/*The Budget App
    Used to calculate incomes and expenses for daily use.
    Build during Udemy course, with guide.
    08/2019
    By Itay Cohen
*/

// Budjet Controler
var budgetControler = (function(){
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPerchantage = function(totalIncome){
        if (totalIncome >0){
            this.percentage = Math.round((this.value / totalIncome) * 100) ;
        }else
        {
            this.percentage = -1; 
        }
    };

    Expense.prototype.getPerchantage = function(){
        return this.percentage;
    }

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
       data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };
    return {
        addItem: function(type,des,val){
            var newItem,id;
            // create new id numric number
            if (data.allItems[type].length >0){
                id = data.allItems[type][data.allItems[type].length -1].id +1;
            }else {
                id=0;
            }
            // create new item inc/exp
            if (type === "exp"){
                newItem =  new Expense(id, des,val);
           } else if (type === "inc"){
                newItem =  new Income(id, des,val);
           }
           // push the data to the data structur;
           data.allItems[type].push(newItem);
           return newItem;
        },

        deleteItem: function (type,id){
            var ids,index;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(parseInt(id));
            if (index!== -1){
                data.allItems[type].splice(index,1);               
            }
        },

        calculateBudjet:function(){
            // calc total income + expenses
            calcTotal("exp");
            calcTotal("inc"); 
            // calc the budjet : income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calc the percentage
            if (data.totals.inc >0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
            else 
            data.percentage = -1;
        },

        calculatePerchantage: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPerchantage(data.totals.inc);
            })
        },
        
        getPerchantage: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPerchantage();
            });
            return allPerc;
        },
        
        getBudjet : function(){
            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalexp : data.totals.exp,
                percentage : data.percentage
            }
        },

        testing : function(){
            console.log(data);
        }
    };

})();

// UI Controler
var UIControler = (function(){
    var DOMstrings = {
        inputTypes: ".add__type",
        descriptionAdder: ".add__description",
        valueAdder : ".add__value",
        buttonAdder :".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budjetLabel :".budget__value",
        incomeLbel : ".budget__income--value",
        expensesLabel: ".budget__expenses--value",
        precentageLabel: ".budget__expenses--percentage",
        container: ".container",
        expensesPerchLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    };
    
    var formatNumber = function(num, type){
        var numSplite, int ,dec ; 
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplite = num.split(".");        
        int = numSplite[0];
        if (int.length > 3 ){
            int = int.substr(0,int.length-3) + "," + int.substr(int.length-3,3);
        }
        dec = numSplite[1];
        return (type === "exp" ? "-" :  "+") + " " + int + "." + dec;
     };

     var nodeListForEach = function(list, callBack){
        for (var i=0; i< list.length; i++){
            callBack(list[i],i)
        }

    };

    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputTypes).value,// will be inc or exp
                description :document.querySelector(DOMstrings.descriptionAdder).value,
                value : parseFloat( document.querySelector(DOMstrings.valueAdder).value)
            };
        },

        addListItem: function(obj, type){
                // create html with placeholder text
                var html,newHtml,element;
                if (type === "inc")
                    {
                        element = DOMstrings.incomeContainer;
                        html = "<div class=\"item clearfix\" id=\"inc-%id%\"><div class=\"item__description\">%description%</div><div class=\"right clearfix\"><div class=\"item__value\">%value%</div><div class=\"item__delete\"><button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button></div></div></div>";
                    }
                else if (type === "exp")
                    {
                        element = DOMstrings.expenseContainer;
                        html = "<div class=\"item clearfix\" id=\"exp-%id%\"><div class=\"item__description\">%description%</div><div class=\"right clearfix\"><div class=\"item__value\">%value%</div><div class=\"item__percentage\">21%</div><div class=\"item__delete\"><button class=\"item__delete--btn\"><i class=\"ion-ios-close-outline\"></i></button></div></div></div>";
                    }                   
                // replace the place holder text
                newHtml = html.replace("%id%",obj.id);
                newHtml = newHtml.replace("%description%",obj.description);
                newHtml = newHtml.replace("%value%",formatNumber(obj.value, type));
                // insert html ->DOM
                document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
        },
        
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.descriptionAdder + ", " + DOMstrings.valueAdder);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current, index, array){
                current.value="";
            });
            fieldsArr[0].focus();
        },

        displayBudjet: function(obj){
            var type;
            obj.budget > 0 ? type = "inc" : type = "exp";
            document.querySelector(DOMstrings.budjetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLbel).textContent = formatNumber(obj.totalInc,"inc");
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalexp,"exp");
            if (obj.percentage > 0)
            {
                document.querySelector(DOMstrings.precentageLabel).textContent = obj.percentage + "%";
            }
            else
            {
                document.querySelector(DOMstrings.precentageLabel).textContent = "***";
            }
        },

        displayPerchantage: function(percentage){
            var fields = document.querySelectorAll(DOMstrings.expensesPerchLabel);
            nodeListForEach(fields,function(current , index){
                if (percentage[index] >0)
                {
                    current.textContent = percentage[index] + "%";
                }else{
                    current.textContent = "***";
                }
            });
        },

        displayMonth : function(){
            var year,month, now = new Date();
            year = now.getFullYear();
            month = now.getMonth() +1;
            document.querySelector(DOMstrings.dateLabel).textContent = month + "/"+  year;

        },

        changeTypes : function(){
            var fields = document.querySelectorAll(
                DOMstrings.inputTypes + "," +
                DOMstrings.descriptionAdder + "," +
                DOMstrings.valueAdder);
                nodeListForEach(fields , function(cur) {
                cur.classList.toggle("red-focus");
            })
            document.querySelector(DOMstrings.buttonAdder).classList.toggle("red");
        },

        getDomStrings: function(){
            return DOMstrings;
        }
    };
})();

// Global App Controelr
var controler = (function(budgetCtrl,UICtrl){
    var setupEventListeners = function(){
        var DOM = UICtrl.getDomStrings();
        document.querySelector(DOM.buttonAdder).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
            if ((event.keyCode === 13) || ( event.which === 13))
                ctrlAddItem();
        });
        document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);
        document.querySelector(DOM.inputTypes).addEventListener("change", UICtrl.changeTypes);
    }
    
    var updateBudjet = function () {
        var budjet;
        // calc the budjet
        budgetControler.calculateBudjet();
        // returne the budget
        budjet = budgetControler.getBudjet();
        // display the budjet-> UI
        UIControler.displayBudjet(budjet);
    }
    
    var updatePerchentage = function(){
        //  calc perch.
        budgetCtrl.calculatePerchantage();
        //  read perchantge from budget ctrl
        var perchantages = budgetCtrl.getPerchantage();   
        //  update UI
        UICtrl.displayPerchantage(perchantages);
    }

    var ctrlAddItem = function(){
        var newItem,input ;
        // TODO : get the field input data
        input = UICtrl.getInput();
        if (input.description!== "" && !isNaN(input.value) && input.value >0 ){
            // add the item to the budjet controler
            newItem = budgetControler.addItem(input.type, input.description, input.value);
            // add the new item to UI
            UIControler.addListItem(newItem,input.type);
            // clear the fields
            UIControler.clearFields();
            // calc + update the budjet
            updateBudjet();
            // calc and update perc
            updatePerchentage();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID){
            splitID = itemID.split("-");
            type = splitID[0];
            ID = splitID[1];
            // delete item from data stracture
            budgetCtrl.deleteItem(type,ID);
            // delete from UI
            UICtrl.deleteListItem(itemID);
            // update the budget
            updateBudjet();
            // calc and update perc
            updatePerchentage();
        }
    };

    return {
        init: function(){
            setupEventListeners();
            UIControler.displayMonth();
            UIControler.displayBudjet({
                budget : 0,
                totalInc : 0,
                totalexp : 0,
                percentage : -1
            })
        }
    }
    
})(budgetControler,UIControler);  

controler.init();