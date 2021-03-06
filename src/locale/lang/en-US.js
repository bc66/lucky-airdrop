export default {
  app_name: 'Lucky Airdrop',
  home: {
    title: 'Send and receive lucky airdrop',
    works_with: 'Works with',
    create_btn: 'Create an Red Envelope',
    faq: {
      title: 'FAQ',
      how_does_work: 'How does Lucky Airdrop work?',
      principle1: {
        title: 'Create and send an envelope',
        content: 'Go to Create to create an envelope. Once the envelope is created, send the URL or QRCode to everyone you want to gift.'
      },
      principle2: {
        title: 'Claim an envelope',
        content: "Go to the URL you received (don't have to install any plugins to open). Click on CLAIM to reveal the amount and claim."
      },
      principle3: {
        title: 'Refund an envelope',
        content: "Once your envelope has expired, you can refund the unclaimed amount back into your account. Go to the URL and click on REFUND."
      },
    },
    donate: {
      title: 'Donate',
      content1: 'If you like my dapp, please consider',
      content2: 'Thank you for your support!'
    }
  },
  identity: {
    title: 'Confirm Your Identity.',
    paragraph1: 'Please confirm that you would like this site to access your account.',
    paragraph2: 'You will receive a identification request pop-up in your sync/comet.'
  },

  account: 'account',
  account_label: 'Your Account',
  balance: 'balance',
  envelope: 'Envelope',
  expires: 'Expires',
  expired: 'Expired',
  loading: {title: 'Send decentralized fortune', content: 'Loading dapp'},
  network: 'Network',

  create: {
    title: 'Create Your Red Envelope',
    identical: {type: 'Identical Amount', change_text: 'Change to Random Amount'},
    random: { type: 'Random Amount', change_text: 'Change to Identical Amount' },
    amount_each: 'Amount Each',
    total: 'Total',
    tip_hint: '0.5% of the total is the tip. No tip for X Node holders.',
    quantity: 'Quantity',
    quantity_hint: 'Enter the number of members between 1 and 100',
    comment_placeholder: 'Best wished 🐶',
    from: {label: 'From', placeholder: 'Anonymous'},
    fee: 'fee',
    fee_hint: 'This is used to pay for the transaction fee when your recipient claims the envelope.',
    create_btn_text: 'Create',
    creating_btn_text: 'Creating...'
  },
  license: 'You understand that you are using free software, provided under MIT License, at your own risk.',
  claim: {
    hint: 'Click CLAIM to see how much you received.',
    claim_btn_text: 'Claim',
    claiming_btn_text: 'Claiming...',
    continue: 'Continue',
    total_claims: 'Total claims',
    max_claims: 'Max Claims',
    no_cliams: 'No claims!',
    claim_history_title: 'In the past 5 hours',
    input_address: 'Input your address',
    input_hint: 'Please input your wallet address to catch your luck.',
    claimed_text: 'You’ve already claimed',
  },
  share: {
    title: 'Send this link to your recipients',
    reminder: 'Do not lose it! Once lost this link cannot be recovered.',
    copy_btn_text: 'Copy',
    copied_btn_text: 'Copied',
  },
  errors: {
    title: 'Please correct the following error(s):',
    amount_cannot_be_empty: 'Amount: can not be empty',
    total_less_100w: 'Total: must be less than 100W',
    quantity_1_100: 'Quantity: must be between 1 and 100',
    message_less_260: 'Message: must be less than 260 characters',
    balance_insufficient: 'Balance: insufficient balance',
    nickname_less_64: 'Nickname: must be less than 64 characters',
  },


}
