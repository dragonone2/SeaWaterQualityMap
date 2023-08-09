document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarClose = document.getElementById("sidebarClose"); // 추가
    const content = document.getElementById("content");
  
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.add("active");
      content.style.marginLeft = "250px";
      sidebarToggle.style.display = "none";
    });
  
    // 추가: 사이드바 닫기 버튼 이벤트 리스너
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("active");
      content.style.marginLeft = "0";
      sidebarToggle.style.display = "block";
    });
  });