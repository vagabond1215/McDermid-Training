const users = [
  {
    email: 'rerhardt@ailpdx.com',
    password: '1qaz2wsx!QAZ@WSX',
    profile: {
      privileges: ['Administrator', 'Manager'],
      contract: 'SA - Supervising Agent',
      sga: 'AO',
      mga: 'Chris La Fond',
      upline: 'Tabitha McDermid',
      trainingStage: 'Complete',
      phoneNumber: '503-381-3341',
      altEmail: 'russellerhardt@aoglobelife.com',
      residentState: 'Oregon'
    }
  },
  {
    email: 'tmdermid@ailpdx.com',
    password: '',
    profile: {}
  }
];

if (typeof window !== 'undefined') {
  window.users = users;
}

