"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300, 100],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2022-04-25T23:36:17.929Z",
    "2022-04-27T10:51:36.790Z",
    "2022-09-29T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 40],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
    "2022-09-29T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerLanding = document.querySelector(".landing-page");
const containerMovements = document.querySelector(".movements");
const containerNav = document.querySelector(".nav__container");
const navBtn = document.querySelector(".navigation__button");

const labelLogin = document.querySelector(".login");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const inputFeld = document.querySelector(".input");

/////////////////////////////////////////////////

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((na) => na[0])
      .join("");
  });
};
createUsername(accounts);

const logout = function () {
  containerApp.style.display = "none";
  containerLanding.style.display = "block";
  containerNav.style.display = "block";
  inputClosePin.value = inputCloseUsername.value = "";
  labelWelcome.textContent = "Log in to get started";
};
const login = function () {
  refreshUserDisplay(currentAccount);
  containerApp.style.display = "grid";

  containerLanding.style.display = "none";
  containerNav.style.display = "none";
  navBtn.style.display = "none";
  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(" ")[0]
  }`;
  containerApp.style.display = "grid";
  const now = new Date();
  labelDate.textContent = new Intl.DateTimeFormat("en-US").format(now);
};

const startLogoutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearTimeout(tick);
      logout();
    }
    time--;
  };
  let time = 100;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const returnTimer = function () {
  if (timer) clearTimeout(timer);
  timer = startLogoutTimer();
};

const formatMovementDate = function (date, locale) {
  const calcDayPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDayPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; //delete innerHtml

  const formatCur = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      stlye: "curreny",
      currency: currency,
    }).format(value);
  };

  const mov = sort
    ? acc.movements.slice().sort((curr, i) => curr - i)
    : acc.movements;
  console.log(mov);

  mov.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);
    const displayMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${displayMov} ${acc.currency}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
  returnTimer();
});

const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, el) => acc + el, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)} ${acc.currency}`;
};

const displaySummary = function (acc) {
  acc.income = acc.movements
    .filter((el) => el > 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumIn.textContent = `${acc.income.toFixed(2)}${acc.currency}`;
  acc.outcome = acc.movements
    .filter((el) => el < 0)
    .reduce((acc, el) => acc + el, 0);
  labelSumOut.textContent = `${Math.abs(acc.outcome).toFixed(2)}${
    acc.currency
  }`;
  acc.interest = acc.movements
    .filter((el) => el > 0)
    .map((el) => (el * acc.interestRate) / 100)
    .filter((el) => el >= 1)
    .reduce((acc, el) => acc + el, 0);
  labelSumInterest.textContent = `${acc.interest.toFixed(2)}${acc.currency}`;
};

const refreshUserDisplay = function (currAcc) {
  displayMovements(currAcc);
  displayBalance(currAcc);
  displaySummary(currAcc);
  returnTimer();
};

let currentAccount, timer;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    login();
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const reciever = accounts.find(
    (acc) => inputTransferTo?.value === acc.username
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    reciever?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    reciever.movements.push(amount);
    reciever.movementsDates.push(new Date());
    refreshUserDisplay(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    refreshUserDisplay(currentAccount);
    inputLoanAmount.value = "";
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin?.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (e) => e.username === currentAccount.username
    );
    accounts.splice(index, 1);
    logout();
  }
});

/////////////////////////////////////////////////
// Landing Page
const showModalBtn = document.querySelectorAll(".btn--show-modal");
const closeModalBtn = document.querySelector(".btn--close-modal");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const navButton = document.querySelector(".navigation__checkbox");
const btnScrollto = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navlink = document.querySelector(".nav__links");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const landingPage = document.querySelector(".landing-page");
const allSections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");

//Scrolling
btnScrollto.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

//Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
const closeModal = function (e) {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

console.log(showModalBtn);
showModalBtn.forEach((btn) => btn.addEventListener("click", openModal));
modal.classList.contains("hidden")
  ? (containerNav.style.display = "flex")
  : (containerNav.style.display = "none");

closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Button scrolling
navlink.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabs
tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  clicked.classList.add("operations__tab--active");
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menü fade Animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.6));
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky Navigation
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting && landingPage.style.display !== "none")
    nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const observer = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0.1,
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

//Revealing Sections
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy loading images
const imgTarget = document.querySelectorAll("img[data-src]");
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  else entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "-200px",
});
imgTarget.forEach((img) => imgObserver.observe(img));

//Slider Component
slides.forEach(
  (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
);
const createDots = function () {
  slides.forEach((s, i) => {
    dotsContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();
const activateDots = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

let currentSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
goToSlide(0);

const nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDots(currentSlide);
};
const prevSlide = function () {
  if (currentSlide > 0) currentSlide--;
  else currentSlide = maxSlide - 1;
  goToSlide(currentSlide);
  activateDots(currentSlide);
};

btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") {
    nextSlide();
  } else if (e.key === "ArrowLeft") {
    prevSlide();
  }
});

dotsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    console.log("dot");
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDots(slide);
  }
});
