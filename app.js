//Storage Ctrl
const StorageCtrl = (function(){

    return{
        addToStorage: function(item){
            let items;
            if(localStorage.getItem('items') === null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item)
            localStorage.setItem('items', JSON.stringify(items));
        },
        getFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            //looks for current item in local storage, gets index of the item and splices it out 
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item,i) => {
                if(item.id === updatedItem.id){
                    items.splice(i, 1, updatedItem); //replace previous item object with updated item obj
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function(delItem){
            //looks for current item in local storage, gets index of the item and splices it out 
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item,i) => {
                if(item.id === delItem.id){
                    items.splice(i, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllInStorage: function(){ //clear storage
            localStorage.removeItem('items')
        }
    }
})();


//Item Ctrl to deal with items
const ItemCtrl = (function(){
    function Item (id, name, calories){ //item constructor
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items : StorageCtrl.getFromStorage()//where created items are stored. gets items from local storage
            // [{id: 0, name: 'Fish', calories: 300},
            // {id: 1, name: 'Rice', calories: 500},
            // {id: 2, name: 'Spaghetti', calories: 600}]
        ,
        currentItem : null,
        totalCalories : 0 //sum of all calories
    }

    //return methods
    return{
        logData : function(){ //returns data object
            return data;
        },
        getTotalCalories : function (){  //loops through items.calories to get total
            let total = 0;

            data.items.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total; //updated totalcalories property in data obj

            return total; //returns total calories
        },
        addItem : function(name, calories){ //adds item to data obj
            let id = data.items.length; //creates id for item
            calories = parseInt(calories);
            let newItem = new Item(id, name, calories); //creates item with arguments
            data.items.push(newItem); //adds to items array
            return newItem; //returns new item
        },
        getItems: function(){ //returns all items in data.items array
            return data.items;
        },
        getItemToEdit: function(id){ //takes id of clicked item, finds item in array and returns item object
            let found = null;
            data.items.forEach(item => {
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){ //changes current item from null to the item passed into the function
            data.currentItem = item;
        },
        getCurrentItem: function(){ //returns current item
            return data.currentItem;
        },
        updateItem: function(name, calories){
            let found = null;

            data.items.forEach(item => {
                //the item to be updated is set as current item so we loop through the items array for the item with the same id as that of the current item i.e the same item, an we update the name and calories 
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = parseInt(calories);
                    found = item;
                }
                
            });
            return found;
        },
        deleteItem: function(){ //looks for current item in items array, gets index of the item in the items array and splices it out 
            let found = null;
            let index = null;
            data.items.forEach(item => {
                if(item.id === data.currentItem.id){
                    index = data.items.indexOf(item);
                    found = item;
                }
            });
            data.items.splice(index, 1);
            return found;
        },
        clearAllItems: function(){
            data.items = []; //items array is made empty
        }
    }
})();

//UI Ctrl
const UICtrl = (function(){
    //create an object that takes ids and classes from html as values
    const UISelectors = {
        itemList : '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn'
    }

    //public methods
    return {
        getSelectors: function(){ //return UISelectors obj
            return UISelectors;
        },
        populateItemList: function(items){ 
            let html = '';
            items.forEach((item) => {
                html +=
                    `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name} :</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                    </li>`
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        addItemList: function(item){ //adds item to list
            document.querySelector(UISelectors.itemList).style.display = 'block'; //displays ul
            const li = document.createElement('li');
            li.classList.add('collection-item');
            li.id = `item-${item.id}`; //add id containing the item.id
            li.innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            //add item before end of list
        },
        getItemInput: function(){
            //return the value of the two inputs in an object
            return {
                name: document.querySelector(UISelectors.itemName).value,
                calories : document.querySelector(UISelectors.itemCalories).value
            }
        },
        displayTotalCalories: function(calories){ //displays total calories 
            document.querySelector(UISelectors.totalCalories).textContent = calories;
        },
        clearFields : function(){ //clears input fields
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        hideList : function(){ //hides item list/ul
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        setInitialState: function(){
            UICtrl.clearFields(); //clear input fields at initial state
            //hide update, delete and back btns
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            //show add btn
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            //show update, delete and back btns
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            //hide add btn
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        addItemToForm: function(){
            //displays current item's name and calories in form fields
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
        },
        updateListItem: function(item){ //display updated item in ui
            const listItems = document.querySelectorAll(UISelectors.listItems); //get all lists
            listItems.forEach(list => { //look for the list in ui that conatins id of updated item
                if(list.getAttribute('id') === `item-${item.id}`){ //update list with new item values in ui
                    list.innerHTML = `<strong>${item.name} :</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(item){ //deletes list from ui
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems.forEach(list => {
                if(list.getAttribute('id') === `item-${item.id}`){
                    list.remove();
                }
                
            })
        },
        removeAllItems: function(){ //remove all list items from ui
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems.forEach(list => {
               list.remove();  
            });
        }
    }
})();


//App
const App = (function(ItemCtrl, UICtrl, StorageCtrl){
    //create load event listeners function
    const loadEventListeners = function(){
        const UISelector = UICtrl.getSelectors(); //get UISelectors obj and stores

        document.querySelector(UISelector.addBtn).addEventListener('click',
        addItemsSubmit); //add event to addbtn

        document.addEventListener('keypress', (e) => { //disable enter event
            if(e.key === 'Enter'){ //if enter is clicked then disable it
                e.preventDefault();
                return false;
            }
        });

        document.querySelector(UISelector.itemList).addEventListener('click', editItem); //adds event to edit icon
        document.querySelector(UISelector.updateBtn).addEventListener('click', updateItem); //add event to update btn
        document.querySelector(UISelector.backBtn).addEventListener('click', UICtrl.setInitialState); //add event to back btn
        document.querySelector(UISelector.deleteBtn).addEventListener('click', deleteItem); //add event to delete btn
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAll); //add event to clear all btn
    }
   
    const addItemsSubmit = function(e){
        const input = UICtrl.getItemInput(); //stores input obj from input fields

        if(input.name !== '' && input.calories !== ''){ //if both input fields are not empty
            const newItem = ItemCtrl.addItem(input.name, input.calories); //create item
            StorageCtrl.addToStorage(newItem); //add new item to storage
            const totalCalories = ItemCtrl.getTotalCalories(); //get total calories after adding new item
            UICtrl.displayTotalCalories(totalCalories); //display total calories
            UICtrl.clearFields(); //clear input field
            UICtrl.addItemList(newItem); //display item in itemlist
            
        }
        e.preventDefault();
    }
    
    const editItem = function(e){
        if(e.target.classList.contains('edit-item')){
            const listId = e.target.parentElement.parentElement.id; //get id of list containing edit icon
            const listIdArr = listId.split('-'); //create an array containing item and item.id 
            const id = parseInt(listIdArr.pop()); //get last element in array which is item.id
            const itemToEdit = ItemCtrl.getItemToEdit(id); //store the item to edit returned from function
            ItemCtrl.setCurrentItem(itemToEdit); //sets item as current item
            UICtrl.addItemToForm(); //displays item in input fields for update to take place
            UICtrl.showEditState(); //show edit state
        }
        e.preventDefault();
    }

    const updateItem = function(e){
        const input = UICtrl.getItemInput(); //get input from fields
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        UICtrl.updateListItem(updatedItem); //show update to list in ui
        StorageCtrl.updateItemStorage(updatedItem); //makes update to storage

        const totalCalories = ItemCtrl.getTotalCalories(); //get total calories after adding new item
        UICtrl.displayTotalCalories(totalCalories); //display total calories
        UICtrl.setInitialState();
        e.preventDefault();
    }

    const deleteItem = function(){
        const itemToBeDeleted = ItemCtrl.deleteItem(); //get item to be deleted
        UICtrl.deleteListItem(itemToBeDeleted); //delete list item from ui
        StorageCtrl.deleteItemStorage(itemToBeDeleted); //delete from storage

        if(ItemCtrl.getItems().length === 0){ //if there are no items hide item list
            UICtrl.hideList();
        }

        const totalCalories = ItemCtrl.getTotalCalories(); //get total calories after adding new item
        UICtrl.displayTotalCalories(totalCalories); //display total calories
        UICtrl.setInitialState();

    }

    const clearAll = function(){
        ItemCtrl.clearAllItems(); //clear data.items array
        const totalCalories = ItemCtrl.getTotalCalories(); //get total calories after adding new item
        UICtrl.displayTotalCalories(totalCalories); //display total calories
        StorageCtrl.clearAllInStorage(); //clear storage
        UICtrl.removeAllItems(); //remove items from ui
        UICtrl.hideList(); //hide list
    }

    //public methods
    return {
        //during initialization of the page
        init: function(){
           UICtrl.setInitialState(); //set initial state

           const items = ItemCtrl.getItems();
           if(items.length === 0){
               UICtrl.hideList(); //if no items, hide list
           }else{
               UICtrl.populateItemList(items); //else populate ui with items in items array gotten from local storage
           }
           
           const totalCalories = ItemCtrl.getTotalCalories(); //get total calories
           UICtrl.displayTotalCalories(totalCalories); //display total calories
           loadEventListeners(); //load event listener function
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl);

App.init();