const financialAnalysisData = {
  userId: '',
  dateCompleted: '',
  month: '',
  year: '',
  fields: {
    income: '',
    housing: '',
    utilities: '',
    transportation: '',
    food: '',
    insurance: '',
    personal: '',
    debt: '',
    savings: ''
  }
};

if (typeof window !== 'undefined') {
  window.financialAnalysisData = financialAnalysisData;
}
