let history = document.querySelector('.showArea__context__history');
let result = document.querySelector('.showArea__context__result');

//運算區陣列
let calArray = [];

//顯示區字串
let calString = '';

let wrapper = document.querySelector('.panel');
wrapper.addEventListener('click', pressKey);

//清空回到預設狀態
function reset() {
    calArray = [];
    calString = '';
    history.innerHTML = '';
    result.setAttribute('style', 'font-size:60px')
    result.innerHTML = '0';
}
reset();

//輸入數字到顯示區

//防止01(顯示區已有0且按下0)
//防止001(顯示區已有0且按下00 || 顯示區是空的且按下00)
//防止最後答案的第一個數字為0

function addNum(str) {
    if(calString =='0' && str=='0') {  
        calString = '0';
    } else if(calString == '0' && str =='00' || calString =='' && str=='00') { 
        calString = '0';
    } else if(calString == '0') {
        calString = '';
        calString+= str;
    } else {
        calString+= str;
    }
    // console.log(calString);
    updateResult();
}

//刪除數字
//顯示區是空值的話，則刪除運算區最後一項資料
function delNum() {
    if(calString == '') {
        calArray.pop();
    } else {
        calString = calString.substring(0, calString.length-1);
    }
    updateResult();
    updateHistory();
}

//將顯示區數字加到運算區
function addToArr() {
    if(calString !== '') {
        calArray.push(calString);
        calString = '';
    }
    // console.log(calArray, calString);
    updateResult();
    updateHistory();
}

//加入小數點
//按下.的同時，顯示區如果是空值，前面加上'0.'
//按下.的同時，顯示區如果還沒有小數點，直接加入小數點
function addDot() {
    if(calString == '') {
        calString = '0.';
    } else if( !(calString.includes('.')) ) {
        calString += '.'
    }
    // console.log('addDot', calString);
    updateResult();
    updateHistory();
}

//加入運算符號
//防止符號多次出現，如果符號多次出現，則刪除
function addOperator(str) {
    let lastNum = Number(calArray[calArray.length - 1]);
    if( isNaN(lastNum) ) {
        calArray.pop();
    }
    if(str =='x') {
        calArray.push('*');
    } else if(str =='÷') {
        calArray.push('/');
    } else {
        calArray.push(str);
    }
    // console.log('addOperator =>', calArray);
    updateResult();
    updateHistory();
}

//數字做千分位
//判斷此字串是否有小數點 只在小數點前加千分位
function addComma(data) {
    if (data.includes(".")) {
        return data.replace(/\d(?=(?:\d{3})+\b\.)/g, '$&,');

    } else {
        return data.replace(/\d(?=(?:\d{3})+\b)/g, '$&,');
    }
}

//計算結果
//如果運算區陣列最後一個值是符號且顯示區是空值，則刪掉符號，若不是，則加到運算陣區陣列中
//eval() => 傳入字串，執行計算
//toPrecision() => 返回指定長度的数值字符串
//parseFloat() => 將字串轉換為以十進位表示的浮點數

function calSum() {
    let lastNum = Number(calArray[calArray.length - 1]);
    if( isNaN(lastNum) && calString == '') {
        calArray.pop();
    }else {
        addToArr();
    }
    let arrResult = eval(calArray.join(''));
    let preciseResult = arrResult.toPrecision(10);
    let parseArrResult = parseFloat(preciseResult);
    // console.log('calSum', calArray, arrResult, parseArrResult);
    updateResult(parseArrResult);
    updateHistory();
}


//更新顯示區
//調整顯示區字級大小，以防破版
function updateResult(parseArrResult) {
    let resultText = '';
    if( typeof(parseArrResult) == 'undefined') {
        resultText = addComma(calString);
    } else {
        resultText = addComma(parseArrResult.toString());
    }
    if(resultText.length > 8) {
        let fontSize = 60-((resultText.length-8)*3)
        if(fontSize < 12) {
            fontSize = 12;
        }
        result.setAttribute('style', 'font-size:' + fontSize +'px');
    } else {
        result.setAttribute('style', 'font-size:60px;');
    }
    result.innerHTML = resultText;
}

//更新運算區
function updateHistory() {
    let historyText = '';
    let copyCalArray = [...calArray];
    console.log(copyCalArray);
    // for(i=0; i<copyCalArray.length; i++) {
    //     copyCalArray[i] = addComma(copyCalArray[i]);
    //     console.log(copyCalArray);
    // }
    historyText = copyCalArray.join('');
    console.log(historyText);
    history.innerHTML = historyText;
}

function pressKey(e) {
    let str = e.target.textContent;
    switch(str) {
        case '+':
        case '-':
        case 'x':
        case '÷':
            addToArr();
            addOperator(str);
            break;
        case '.':
            addDot();
            break;
        case 'AC':
            reset();
            break;
        case '⌫':
            delNum();
            break;
        case '=':
            calSum();
            break;
        default:
            addNum(str);
            break;
    }
}


