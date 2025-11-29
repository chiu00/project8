// script.js

const petImages = {
  dog: "https://images.unsplash.com/photo-1558788353-f76d92427f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzA1NzZ8MHwxfHNlYXJjaHwxfHxkb2d8ZW58MHx8fHwxNjY3Mjg0MzQ0&ixlib=rb-4.0.3&q=80&w=200",
  cat: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5NzA1NzZ8MHwxfHNlYXJjaHwxfHxjYXR8ZW58MHx8fHwxNjY3Mjg0MzU4&ixlib=rb-4.0.3&q=80&w=200"
};

const calcBtn = document.getElementById("calcBtn");
const resultDiv = document.getElementById("result");
const petPixelImg = document.getElementById("petPixel");

// 初始不顯示圖案
petPixelImg.style.display = "none";

function getSelectedPet() {
  const radios = document.getElementsByName("pet");
  for (let radio of radios) {
    if (radio.checked) return radio.value;
  }
  return "dog";
}

function calculateAge(birthdateStr, petType) {
  const birthdate = new Date(birthdateStr);
  if (isNaN(birthdate)) return null;

  const today = new Date();

  // 計算貓狗年齡（年 + 月 / 12）
  let years = today.getFullYear() - birthdate.getFullYear();
  let months = today.getMonth() - birthdate.getMonth();
  let days = today.getDate() - birthdate.getDate();
  if (days < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let petAge = years + months / 12;
  petAge = Math.round(petAge * 10) / 10; // 保留小數1位

  // 換算成人類年齡
  let humanAge = 0;
  if (petType === "dog") {
    if (petAge <= 0) humanAge = 0;
    else humanAge = 16 * Math.log(petAge) + 31;
  } else if (petType === "cat") {
    if (petAge <= 0) humanAge = 0;
    else if (petAge <= 1) humanAge = 15;
    else if (petAge <= 2) humanAge = 24;
    else humanAge = 24 + (petAge - 2) * 4;
  }

  humanAge = Math.round(humanAge * 10) / 10; // 保留小數1位

  return { petAge, humanAge };
}

function displayResult(petType, birthdateStr) {
  const ageInfo = calculateAge(birthdateStr, petType);
  if (!ageInfo) {
    alert("日期格式錯誤，請使用 YYYY/MM/DD");
    return;
  }

  resultDiv.innerHTML = `${petType === "dog" ? "狗狗" : "貓貓"}現在大約 ${ageInfo.petAge.toFixed(1)} 歲，換算成人類年齡大約 ${ageInfo.humanAge.toFixed(1)} 歲`;

  petPixelImg.src = petImages[petType];
  petPixelImg.alt = petType === "dog" ? "狗狗像素圖" : "貓貓像素圖";
  petPixelImg.style.display = "inline-block";

  localStorage.setItem("petType", petType);
  localStorage.setItem("birthdate", birthdateStr);
}

calcBtn.addEventListener("click", () => {
  const petType = getSelectedPet();
  const birthdateStr = document.getElementById("birthdate").value.trim();
  if (!birthdateStr) {
    alert("請輸入出生日期！");
    return;
  }
  displayResult(petType, birthdateStr);
});

window.addEventListener("load", () => {
  const savedPet = localStorage.getItem("petType");
  const savedDate = localStorage.getItem("birthdate");
  if (savedPet && savedDate) {
    const radios = document.getElementsByName("pet");
    for (let radio of radios) {
      radio.checked = radio.value === savedPet;
    }
    document.getElementById("birthdate").value = savedDate;
    displayResult(savedPet, savedDate);
  }
});
