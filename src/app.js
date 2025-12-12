  // Utility
const fmt = (v, cur='₼') => (Number(v).toLocaleString('az-AZ', {maximumFractionDigits:2, minimumFractionDigits:2}) + ' ' + cur);


// controls
const amountRange = document.getElementById('amountRange');
const amountVal = document.getElementById('amountVal');
const termChips = document.getElementById('termChips');


const carPriceRange = document.getElementById('carPriceRange');
const carPriceVal = document.getElementById('carPriceVal');
const downRange = document.getElementById('downRange');
const downVal = document.getElementById('downVal');
const carRateRange = document.getElementById('carRateRange');
const carRateVal = document.getElementById('carRateVal');
const carTermRange = document.getElementById('carTermRange');
const carTermVal = document.getElementById('carTermVal');


// result els
const bigVal = document.getElementById('bigVal');
const loanVal = document.getElementById('loanVal');
const rateVal = document.getElementById('rateVal');
const feeVal = document.getElementById('feeVal');
const totalVal = document.getElementById('totalVal');
const resultTitle = document.getElementById('resultTitle');

// initial update
amountVal.innerText = fmt(amountRange.value);
carPriceVal.innerText = fmt(carPriceRange.value);
downVal.innerText = downRange.value + ' %';
carRateVal.innerText = carRateRange.value + ' %';
carTermVal.innerText = carTermRange.value + ' ay';


// term chip logic
termChips.addEventListener('click', e=>{
const chip = e.target.closest('.chip');
if(!chip) return;
termChips.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
chip.classList.add('active');
// when term changes, recalc
calcCar();
});


// range listeners
amountRange.addEventListener('input', ()=>{ amountVal.innerText = fmt(amountRange.value); /* use for deposit */ calcDeposit(); });
carPriceRange.addEventListener('input', ()=>{ carPriceVal.innerText = fmt(carPriceRange.value); calcCar(); });
downRange.addEventListener('input', ()=>{ downVal.innerText = downRange.value + ' %'; calcCar(); });
carRateRange.addEventListener('input', ()=>{ carRateVal.innerText = carRateRange.value + ' %'; calcCar(); });
carTermRange.addEventListener('input', ()=>{ carTermVal.innerText = carTermRange.value + ' ay'; calcCar(); });

// initial calculations
function calcCar(){
// read values
const price = Number(carPriceRange.value);
const downPct = Number(downRange.value)/100;
const rate = Number(carRateRange.value)/100; // annual
const months = Number(carTermRange.value);
const down = Math.round(price * downPct);
const loan = price - down;
const monthlyRate = rate/12;
// annuity payment
const A = monthlyRate === 0 ? loan/months : loan * monthlyRate / (1 - Math.pow(1+monthlyRate, -months));
// commission example: 0.5% of price, min 20
const commission = Math.max( Math.round(price*0.005), 20 );
const totalCreditPayment = A*months;
const totalAll = totalCreditPayment + down + commission;


// update UI
resultTitle.innerText = 'Aylıq kredit ödənişi';
bigVal.innerText = fmt(A);
loanVal.innerText = fmt(loan);
rateVal.innerText = (Number(carRateRange.value)).toFixed(1) + ' %';
feeVal.innerText = fmt(commission);
totalVal.innerText = fmt(totalAll);
}

// deposit example (simple monthly compounding with monthly contribution)
function calcDeposit(){
const principal = Number(amountRange.value);
const selectedChip = termChips.querySelector('.chip.active');
const months = selectedChip ? Number(selectedChip.getAttribute('data-months')) : 6;
const annualRate = 6/100; // example
const r = annualRate/12;
const fv = principal * Math.pow(1+r, months);
// display in result card
resultTitle.innerText = 'Ümumi qazanç';
bigVal.innerText = fmt((fv - principal).toFixed(2));
loanVal.innerText = fmt(principal);
rateVal.innerText = '6 %';
feeVal.innerText = fmt( (fv).toFixed(2) );
totalVal.innerText = fmt( (fv).toFixed(2) );
}


// run initial car calc to match sample
calcCar();

// Tab switching (keeps same controls but conceptually)
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click', e=>{
document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
e.currentTarget.classList.add('active');
const name = e.currentTarget.getAttribute('data-tab');
// show/hide fields per tab
if(name==='avto'){
document.getElementById('carFields').style.display = 'block';
amountRange.parentElement.parentElement.style.display = 'none';
resultTitle.innerText = 'Aylıq kredit ödənişi';
calcCar();
} else if(name==='deposit'){
document.getElementById('carFields').style.display = 'none';
amountRange.parentElement.parentElement.style.display = 'block';
resultTitle.innerText = 'Ümumi qazanç';
calcDeposit();
} else {
// fallback to car view
document.getElementById('carFields').style.display = 'block';
amountRange.parentElement.parentElement.style.display = 'none';
calcCar();
}
}));

// Initial state: show car fields, hide general amount
document.querySelectorAll('.tab').forEach(t=>{ if(t.getAttribute('data-tab')==='avto') t.classList.add('active'); });
document.getElementById('carFields').style.display = 'block';
amountRange.parentElement.parentElement.style.display = 'none';