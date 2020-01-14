export default {
    app_name: '幸运空投',
    home: {
      title: '发送和领取您的幸运空投',
      works_with: '运行环境',
      create_btn: '创建一个红包',
      faq: {
        title: 'FAQ',
        how_does_work: '如何使用幸运空投?',
        principle1: {
          title: '创建并发送红包',
          content: '点击「创建一个红包」按钮进入创建页面。一旦创建成功您将得到红包的分享链接或二维码，将该链接通过社交渠道分享给您的朋友。'
        },
        principle2: {
          title: '领取红包',
          content: "在浏览器打开上述链接(无需安装任何插件)，点击「领取」按钮即可领取分享者的红包。"
        },
        principle3: {
          title: '撤回红包',
          content: "当红包过期之后，您可以点击撤回按钮领取剩余的金额到红包创建者的钱包地址。"
        },
      },
      donate: {
        title: '捐赠',
        content1: '如果您喜欢这个应用，可以考虑通过',
        content2: '来捐赠开发者。非常感谢您的支持！'
      }
    },
    identity: {
      title: '确认您的身份',
      paragraph1: '请确认并同意本应用获取您的钱包地址。',
      paragraph2: '您将收到身份确认的弹窗在您的 Sync 或 Comet 中。'
    },
  
    account: '账户地址',
    account_label: '您的账户',
    balance: '账户余额',
    envelope: '红包',
    expires: '过期',
    expired: '已过期',
    loading: {title: '发送您的去中心化资产', content: '正在载入应用'},
    network: '网络',
  
    create: {
      title: '创建空投红包',
      identical: {type: '当前为普通红包', change_text: '改为拼手气红包'},
      random: { type: '当前为拼手气红包', change_text: '改为普通红包' },
      amount_each: '单个金额',
      total: '总金额',
      tip_hint: '非X节点持有地址将收取总金额 0.5% 的小费',
      quantity: '数量',
      quantity_hint: '请输入1到100之间的整数',
      comment_placeholder: '恭喜发财，鼠年行大运',
      from: {label: '发送人', placeholder: '匿名'},
      fee: '交易手续费',
      fee_hint: '用于为领取红包的人支付区块链交易手续费',
      create_btn_text: '创建',
      creating_btn_text: '创建中...'
    },
    license: '',
    claim: {
      hint: '点击「领取」按钮打开红包',
      claim_btn_text: '领取',
      claiming_btn_text: '领取中...',
      continue: '继续',
      total_claims: '已领取数',
      max_claims: '红包总数',
      no_cliams: '尚无领取记录',
      claim_history_title: '在过去5个小时内',
      input_address: '输入地址',
      input_hint: '请输入您的钱包地址来领取红包',
      claimed_text: '您已成功领取'
    },
    share: {
      title: '红包分享链接',
      reminder: '请妥善保存该链接！',
      copy_btn_text: '复制',
      copied_btn_text: '已复制！',
    },
    errors: {
      title: '请修复下列错误:',
      amount_cannot_be_empty: '金额: 不能为空',
      total_less_100w: '总金额: 必须小于100万',
      quantity_1_100: '数量: 必须在1到100之间',
      message_less_260: '祝福语: 不能大于260个字符',
      balance_insufficient: '余额: 账户余额不足',
      nickname_less_64: '昵称: 不能大于64个字符',
    },
  
  
  }
  