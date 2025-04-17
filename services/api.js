export const sendSmsToApi = async (smsData) => {
  try {
    const response = await fetch('https://mock.com/api/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(smsData),
    });

    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('API 호출 실패:', error);
  }
};
