export type SupportedLanguage = 'en' | 'sw' | 'ar';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  roles: {
    donor: string;
    ngo: string;
    verifier: string;
    beneficiary: string;
    vendor: string;
    explorer: string;
  };
  nav: {
    home: string;
    explorer: string;
    programs: string;
    vouchers: string;
    connectWallet: string;
    disconnect: string;
    offline: string;
    online: string;
  };
  metrics: {
    totalFunded: string;
    totalReleased: string;
    activePrograms: string;
    vouchersRedeemed: string;
    solvencyRatio: string;
  };
  actions: {
    fundProgram: string;
    createProgram: string;
    approveMilestone: string;
    issueVouchers: string;
    redeemVoucher: string;
    exportCsv: string;
    viewEvidence: string;
    viewExplorer: string;
    retry: string;
    confirm: string;
    cancel: string;
  };
  beneficiary: {
    myVouchers: string;
    availableBalance: string;
    scanToRedeem: string;
    showQrCode: string;
    expired: string;
    redeemed: string;
    expiresIn: string;
  };
  vendor: {
    scannerTitle: string;
    scanInstructions: string;
    claimPayment: string;
    payoutHistory: string;
    approvedCategory: string;
  };
  offline: {
    bannerTitle: string;
    bannerDesc: string;
    syncPending: string;
    queueCount: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'Kindred AidTrail',
    tagline: 'Transparent Humanitarian Grant & Aid Disbursement on Stellar',
    roles: {
      donor: 'Donor',
      ngo: 'NGO Administrator',
      verifier: 'Independent Verifier',
      beneficiary: 'Beneficiary',
      vendor: 'Whitelisted Vendor',
      explorer: 'Public Explorer',
    },
    nav: {
      home: 'Overview',
      explorer: 'Public Audit Trail',
      programs: 'Aid Programs',
      vouchers: 'My Vouchers',
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      offline: 'Offline Mode Active',
      online: 'Connected to Network',
    },
    metrics: {
      totalFunded: 'Total Capital Funded',
      totalReleased: 'Milestones Released',
      activePrograms: 'Active Programs',
      vouchersRedeemed: 'Vouchers Redeemed',
      solvencyRatio: 'Contract Solvency',
    },
    actions: {
      fundProgram: 'Fund Program',
      createProgram: 'Create Program',
      approveMilestone: 'Approve Milestone',
      issueVouchers: 'Issue Vouchers',
      redeemVoucher: 'Redeem Voucher',
      exportCsv: 'Export CSV Audit',
      viewEvidence: 'Inspect Evidence',
      viewExplorer: 'View on StellarExpert',
      retry: 'Retry Action',
      confirm: 'Confirm & Sign',
      cancel: 'Cancel',
    },
    beneficiary: {
      myVouchers: 'My Digital Aid Vouchers',
      availableBalance: 'Available Balance',
      scanToRedeem: 'Present QR Code to Whitelisted Merchant',
      showQrCode: 'Display Voucher QR',
      expired: 'Expired',
      redeemed: 'Redeemed',
      expiresIn: 'Expires in',
    },
    vendor: {
      scannerTitle: 'Scan Beneficiary Voucher',
      scanInstructions: 'Point camera at beneficiary QR code to verify validity and claim direct smart contract settlement.',
      claimPayment: 'Claim Settlement',
      payoutHistory: 'Merchant Payout Ledger',
      approvedCategory: 'Authorized Merchant Category',
    },
    offline: {
      bannerTitle: 'Operating in Low-Bandwidth / Offline Mode',
      bannerDesc: 'Redemptions are stored cryptographically in local offline storage and will sync automatically upon reconnection.',
      syncPending: 'Syncing Offline Transactions...',
      queueCount: 'Pending Offline Redemptions',
    },
  },

  sw: {
    appName: 'Kindred AidTrail',
    tagline: 'Mfumo wa Uwazi wa Ugawaji wa Misaada Kwenye Mtandao wa Stellar',
    roles: {
      donor: 'Msaidizi / Mfadhili',
      ngo: 'Msimamizi wa Shirika',
      verifier: 'Mhakiki Huru',
      beneficiary: 'Mnufaika',
      vendor: 'Mfanyabiashara Aliyeidhinishwa',
      explorer: 'Ukaguzi wa Umma',
    },
    nav: {
      home: 'Mwanzo',
      explorer: 'Ukaguzi wa Umma',
      programs: 'Programu za Msaada',
      vouchers: 'Vocha Zangu',
      connectWallet: 'Unganisha Mkoba',
      disconnect: 'Ondoka',
      offline: 'Hali ya Nje ya Mtandao',
      online: 'Umeunganishwa Mtandaoni',
    },
    metrics: {
      totalFunded: 'Jumla ya Fedha Zilizotolewa',
      totalReleased: 'Misaada Iliyofunguliwa',
      activePrograms: 'Programu Zinazoendelea',
      vouchersRedeemed: 'Vocha Zilizotumika',
      solvencyRatio: 'Uwiano wa Ukwasi wa Mkataba',
    },
    actions: {
      fundProgram: 'Fadhili Programu',
      createProgram: 'Anzisha Programu',
      approveMilestone: 'Idhinisha Hatua',
      issueVouchers: 'Toa Vocha',
      redeemVoucher: 'Tumia Vocha',
      exportCsv: 'Pakua Ripoti ya CSV',
      viewEvidence: 'Tazama Ushahidi',
      viewExplorer: 'Fuatilia Kwenye StellarExpert',
      retry: 'Jaribu Tena',
      confirm: 'Thibitisha na Weka Sahihi',
      cancel: 'Ghairi',
    },
    beneficiary: {
      myVouchers: 'Vocha Zangu za Kidijitali za Msaada',
      availableBalance: 'Salio Linalopatikana',
      scanToRedeem: 'Onyesha Msimbo wa QR kwa Mfanyabiashara',
      showQrCode: 'Onyesha Vocha QR',
      expired: 'Imeisha Muda',
      redeemed: 'Imetumika',
      expiresIn: 'Inaisha baada ya',
    },
    vendor: {
      scannerTitle: 'Soma Vocha ya Mnufaika',
      scanInstructions: 'Elekeza kamera kwenye msimbo wa QR wa mnufaika ili kuthibitisha na kupokea malipo moja kwa moja kutoka kwa mkataba wa smart.',
      claimPayment: 'Dai Malipo',
      payoutHistory: 'Historia ya Malipo ya Mfanyabiashara',
      approvedCategory: 'Kitengo cha Biashara Kilichoidhinishwa',
    },
    offline: {
      bannerTitle: 'Inafanya Kazi Bila Mtandao (Offline)',
      bannerDesc: 'Miamala inahifadhiwa kwa usalama kwenye kifaa na itawasilishwa mtandao ukirejea.',
      syncPending: 'Inawasilisha Miamala ya Nje ya Mtandao...',
      queueCount: 'Vocha Zinazosubiri Kutumwa',
    },
  },

  ar: {
    appName: 'كيندرد إيدتريل',
    tagline: 'منصة شفافة لتوزيع المنح والمساعدات الإنسانية عبر شبكة ستيلار',
    roles: {
      donor: 'المتبرع',
      ngo: 'المنظمة الإنسانية',
      verifier: 'المدقق المستقل',
      beneficiary: 'المستفيد',
      vendor: 'التاجر المعتمد',
      explorer: 'مستكشف الشفافية العام',
    },
    nav: {
      home: 'الرئيسية',
      explorer: 'سجل التدقيق العام',
      programs: 'برامج الإغاثة',
      vouchers: 'قسائمي',
      connectWallet: 'ربط المحفظة',
      disconnect: 'قطع الاتصال',
      offline: 'وضع عدم الاتصال نشط',
      online: 'متصل بالشبكة',
    },
    metrics: {
      totalFunded: 'إجمالي التمويل',
      totalReleased: 'المراحل المصروفة',
      activePrograms: 'البرامج النشطة',
      vouchersRedeemed: 'القسائم المصروفة',
      solvencyRatio: 'نسبة الملاءة المالية للعقد',
    },
    actions: {
      fundProgram: 'تمويل البرنامج',
      createProgram: 'إنشاء برنامج جديد',
      approveMilestone: 'اعتماد المرحلة',
      issueVouchers: 'إصدار القسائم',
      redeemVoucher: 'صرف القسيمة',
      exportCsv: 'تصدير تقرير CSV',
      viewEvidence: 'فحص الأدلة الميدانية',
      viewExplorer: 'عرض على StellarExpert',
      retry: 'إعادة المحاولة',
      confirm: 'تأكيد وتوقيع',
      cancel: 'إلغاء',
    },
    beneficiary: {
      myVouchers: 'قسائم المساعدات الرقمية الخاصة بي',
      availableBalance: 'الرصيد المتاح',
      scanToRedeem: 'أظهر رمز الاستجابة السريعة للتاجر المعتمد',
      showQrCode: 'عرض رمز القسيمة',
      expired: 'منتهية الصلاحية',
      redeemed: 'تم الصرف',
      expiresIn: 'تنتهي خلال',
    },
    vendor: {
      scannerTitle: 'مسح قسيمة المستفيد',
      scanInstructions: 'وجّه الكاميرا نحو رمز QR الخاص بالمستفيد للتحقق وصرف الدفعة مباشرة عبر العقد الذكي.',
      claimPayment: 'طلب الصرف',
      payoutHistory: 'سجل مدفوعات التاجر',
      approvedCategory: 'الفئة التجارية المعتمدة',
    },
    offline: {
      bannerTitle: 'العمل في وضع الاتصال المنخفض / دون إنترنت',
      bannerDesc: 'يتم حفظ عمليات الاسترداد مشفرة على الجهاز وسيتم مزامنتها تلقائيًا عند عودة الاتصال.',
      syncPending: 'جارٍ مزامنة العمليات غير المتصلة...',
      queueCount: 'قسائم في انتظار المزامنة',
    },
  },
};
