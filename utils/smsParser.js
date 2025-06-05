export const parseSms = (smsBody) => {
  // 예시: "입금 완료: 5000원"
  const regex = /입금\s+완료\s*[:：]?\s*(\d+)\s*원/;
  const match = smsBody.match(regex);

  if (match && match[1]) {
    return {
      shouldSend: true,
      data: {
        amount: match[1], // 금액
        date: new Date().toISOString(), // 입금 날짜
      },
    };
  }

  return { shouldSend: false };
};
