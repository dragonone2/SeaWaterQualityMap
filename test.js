function updateCurrentTime() {
  const currentTimeElement = document.getElementById("current-time");
  const currentTime = new Date();
  
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  
  currentTimeElement.textContent = `현재 시간: ${formattedTime}`;
}

// 초당 한 번씩 현재 시간 업데이트
setInterval(updateCurrentTime, 1000);
