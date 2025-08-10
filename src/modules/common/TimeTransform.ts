export function TimeTransform(time: string) {
  const koreaDate = new Date(time).toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  const koreaTime = new Date(time).toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  return { date: koreaDate, time: koreaTime };
}
