pragma solidity 0.5.0;

library LSafeMath {


    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
        c = _a + _b;
        assert(c >= _a);
        return c;
    }
    
    /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
        assert(_b <= _a);
        return _a - _b;
    }

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
        // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (_a == 0) {
            return 0;
        }

        c = _a * _b;
        assert(c / _a == _b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
        // assert(_b > 0); // Solidity automatically throws when dividing by 0
        // uint256 c = _a / _b;
        // assert(_a == _b * c + _a % _b); // There is no case in which this doesn't hold
        return _a / _b;
    }

}

contract Ownable {
    // solium-disable security/no-tx-origin
    address public owner;

    // Emit when ownership transfer to new owner
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
    * @dev The Ownable constructor sets the original `owner` of the contract to the sender
    * account.
    */
    constructor() public {
        owner = msg.sender;
    }

    /**
    * @dev Throws if called by any account other than the owner.
    */
    modifier onlyOwner() {
        require(msg.sender == owner, "permission denied");
        _;
    }

    /**
    * @dev Allows the current owner to transfer control of the contract to a newOwner.
    * @param newOwner The address to transfer ownership to.
    */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "invalid address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

interface IVIP180 {
    function transfer(address _to, uint256 _value) external;
    function transferFrom(address _from, address _to, uint256 _value) external;

    function allowance(address _owner, address _spender) external view returns(uint256);
}

interface IThorNode {
    function isX(address _target) external view returns(bool);
}

// solium-disable security/no-block-members
contract LuckyAirdrop is Ownable {
    using LSafeMath for uint256;

    uint256 private min_amount = 6000000000000000;  // 0.006
    uint256 private max_amount = 1000000 * 10**18;  // 100W

    uint64 private min_expire_days = 1 days;
    uint64 private max_expire_days = 7 days;

    uint64 private min_claims = 1;
    uint64 private max_claims = 100;

    IThorNode public ThorNode;
    uint16  public TIP_PCT = 5; // 0.5%

    // 0: Normal, 1: Random
    enum EnvelopeType { Normal, Random }
    enum EnvelopeStatus { Created, Claimed, Empty }

    struct Envelope {
        uint256 id;
        EnvelopeType envelopeType;
        EnvelopeStatus status;
        
        address secretSigner;
        address payable creator;
        string nickname;

        uint64 expiredAt;
        uint256 initialBalance;
        uint256 remainingBalance;

        address tokenAddr;          // when is a VIP180 red envelope
        string messageLink;         // Hash for IPFS

        uint64 maxClaims;
        uint64 totalClaims;
        uint64 lastClaimTime;

        mapping(address => uint256) claims;
    }

    mapping(uint256 => Envelope) private envelopes;

    uint256 public envelopeIndex;
    address payable public devAddr;

    modifier notEnded(uint256 _id) {
        require(envelopes[_id].expiredAt > now && envelopes[_id].remainingBalance > 0, "too late");
        _;
    }

    modifier notEmpty(uint256 _id) {
        require (envelopes[_id].status != EnvelopeStatus.Empty, "invalid envelope id");
        _;
    }

    modifier expired(uint256 _id) {
        require (envelopes[_id].expiredAt <= now, "too late");
        _;
    }

    modifier requireClaimerNotClaimed(uint256 _id, address _claimerAddr) {
        require (envelopes[_id].claims[_claimerAddr] == 0, "cannot claim twice");
        _;
    }

    event EnvelopeCreated(uint256 indexed _id, address indexed _from);
    event EnvelopeClaimed(uint256 indexed _id, address indexed _from, uint256 _value);
    event EnvelopeRefunded(uint256 indexed _id, address indexed _from, uint256 _value);

    constructor(address payable _devAddr, address _thorNode) public {
        require(_devAddr != address(0), "invalid address");
        require(_thorNode != address(0), "invalid address");
        devAddr = _devAddr;
        ThorNode = IThorNode(_thorNode);
    }

    // create new envelope
    function newEnvelope(
        EnvelopeType _envelopeType,
        string memory _nickname,
        uint64 _duration,
        string memory _messageLink,
        uint64 _maxClaims,
        address _secretSigner
    )
        public
        payable
    {
        require (msg.value >= min_amount, "amount too small");
        require (msg.value <= max_amount, "amount too large");
        require (min_expire_days <= _duration && _duration <= max_expire_days, "invalid duration");
        require (min_claims <= _maxClaims && _maxClaims <= max_claims, "invalid claims");
        require (_secretSigner != address(0), "invalid secretSigner");

        envelopeIndex += 1;
        
        (Envelope memory env, uint256 tipAmount) = _createEnvelope(_secretSigner, msg.value, _envelopeType, _nickname, _duration, _messageLink, _maxClaims);

        env.id = envelopeIndex;
        envelopes[envelopeIndex] = env;
        
        emit EnvelopeCreated(envelopeIndex, msg.sender);

        if (tipAmount > 0) {
            devAddr.transfer(tipAmount);
        }
    }

    function newVIP180Envelope(
        EnvelopeType _envelopeType,
        uint256 _amount,
        string memory _nickname,
        uint64 _duration,
        string memory _messageLink,
        uint64 _maxClaims,
        address _secretSigner,
        address _tokenAddr
    )
        public
    {
        require (_amount >= min_amount, "amount too small");
        require (_amount <= max_amount, "amount too large");
        require (min_expire_days <= _duration && _duration <= max_expire_days, "invalid duration");
        require (min_claims <= _maxClaims && _maxClaims <= max_claims, "invalid claims");
        require (_secretSigner != address(0), "invalid secretSigner");

        IVIP180 token = IVIP180(_tokenAddr);
        require(token.allowance(msg.sender, address(this)) >= _amount, "no sufficient allowance");
        token.transferFrom(msg.sender, address(this), _amount);

        envelopeIndex += 1;

        (Envelope memory env, uint256 tipAmount) = _createEnvelope(_secretSigner, _amount, _envelopeType, _nickname, _duration, _messageLink, _maxClaims);
        
        env.id = envelopeIndex;
        env.tokenAddr = _tokenAddr;
        envelopes[envelopeIndex] = env;
        
        emit EnvelopeCreated(envelopeIndex, msg.sender);

        if (tipAmount > 0) {
            IVIP180(env.tokenAddr).transfer(devAddr, tipAmount);
        }
    }

	// check and update envelope based on claim
    function claimEnvelope(uint256 _id, address payable _claimerAddr, bytes memory _signature) public
        notEnded(_id)
        requireClaimerNotClaimed(_id, _claimerAddr)
    {
        Envelope storage env = envelopes[_id];

        bytes32 signatureHash = keccak256(abi.encode(_id, _claimerAddr));
        require (env.secretSigner == _recover(signatureHash, _signature), "ECDSA signature is not valid.");
        
        uint256 claimAmount = _generateClaimAmount(env);
        
        env.totalClaims += 1;
        env.claims[_claimerAddr] = claimAmount;
        env.lastClaimTime = uint64(now);
        env.remainingBalance = env.remainingBalance.sub(claimAmount);
        env.status = EnvelopeStatus.Claimed;

        if (env.remainingBalance == 0) {
            env.status = EnvelopeStatus.Empty;
        }

        _transferToken(env, _claimerAddr, claimAmount);
        emit EnvelopeClaimed(_id, _claimerAddr, claimAmount);
    }

	// refund envelope when expired
    function refundEnvelope(uint256 _id) public 
	    expired(_id)
	    notEmpty(_id)
	{
        Envelope storage env = envelopes[_id];

        uint256 refundAmount = env.remainingBalance;
        env.remainingBalance = 0;
        env.status = EnvelopeStatus.Empty;

        _transferToken(env, env.creator, refundAmount);
        emit EnvelopeRefunded(_id, env.creator, refundAmount);
    }

    function getEnvelopeInfo(uint256 _id)
        public
        view
        returns(EnvelopeType, EnvelopeStatus, address, string memory, uint64, string memory, uint64)
    {
        return (
            envelopes[_id].envelopeType,
            envelopes[_id].status,
            envelopes[_id].creator,
            envelopes[_id].nickname,
            envelopes[_id].expiredAt,
            envelopes[_id].messageLink,
            envelopes[_id].lastClaimTime
        );
    }

    function getEnvelopeReveal(uint _id) public view returns (address, uint64, uint64, uint256, uint256, address) {
        Envelope storage env = envelopes[_id];
        return (env.tokenAddr, env.maxClaims, env.totalClaims, env.initialBalance, env.remainingBalance, env.secretSigner);
    }

    function getClaimInfo(uint256 _id, address _claimer) public view returns (uint256) {
        return envelopes[_id].claims[_claimer];
    }

    /// Management Functions

    function setTipPct(uint8 _pct) public onlyOwner {
        TIP_PCT = _pct;
    }

    function setDevAddress(address payable _newAddr) public onlyOwner {
        devAddr = _newAddr;
    }

    function setClaims(uint64 _min, uint64 _max) public onlyOwner {
        require(_min <= _max, "_min must greater than _max");
        require(_max > 0, "must greater than zero");
        min_claims = _min;
        max_claims = _max;
    }

    function setAmount(uint256 _min, uint256 _max) public onlyOwner {
        require(_min <= _max, "_min must greater than _max");
        require(_max > 0, "must greater than zero");
        min_amount = _min;
        max_amount = _max;
    }

    /// Internal Functions

    function _createEnvelope(
        address _secretSigner,
        uint256 _amount,
        EnvelopeType _envelopeType,
        string memory _nickname,
        uint64 _duration,
        string memory _messageLink,
        uint64 _maxClaims
    )
        internal
        view
        returns(Envelope memory, uint256)
    {
        Envelope memory env;
        
        uint256 tipAmount = 0;
        env.secretSigner = _secretSigner;

        // no tip if msg.sender is X
        if (!ThorNode.isX(msg.sender)) {
            tipAmount = _amount.mul(TIP_PCT).div(1000);
            _amount = _amount.sub(tipAmount);
        }

        env.envelopeType = _envelopeType;
        env.creator = msg.sender;
        env.nickname = _nickname;
        env.expiredAt = uint64(now) + _duration;
        env.initialBalance = _amount;
        env.remainingBalance = env.initialBalance;
        env.messageLink = _messageLink;
        env.maxClaims = _maxClaims;
        env.status = EnvelopeStatus.Created;

        return (env, tipAmount);
    }

    function _transferToken(Envelope memory _env, address payable _recipient, uint256 _amount) internal {
        require(_amount != 0, "invalid amount");
        if (_env.tokenAddr != address(0)) {
            IVIP180(_env.tokenAddr).transfer(_recipient, _amount);
        } else {
            _recipient.transfer(_amount);
        }
    }

    function _generateClaimAmount(Envelope memory _env) internal view returns (uint256) {	
        uint256 _remain = _env.remainingBalance;
        uint256 _portion = _env.maxClaims - _env.totalClaims;

        if (_env.maxClaims - _env.totalClaims <= 1) {
            return _remain;
        }
        if (_env.envelopeType == EnvelopeType.Normal) {
            return _remain.div(_portion);
        }

        uint256 amount = uint256(blockhash(block.number-1)) % (_remain / _portion) + (_remain / _portion * 20 / 100);

        require(amount > 0 && amount <= _remain, "generate amount error");
        return amount;
    }

    /**
     * @dev Recover signer address from a message by using their signature
     * @param hash bytes32 message, the hash is the signed message. What is recovered is the signer address.
     * @param signature bytes signature, the signature is generated using web3.eth.sign()
     */
    function _recover(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (signature.length != 65) {
            return address(0);
        }

        // Divide the signature in r, s and v variables
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        // solium-disable-next-line
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(hash, v, r, s);
        }
    }

}