// Storage controller
const StrCtrl = (function () {

    return {
        AddItemToLs: item => {
            let items = [];
            if (localStorage.getItem('item') === null) {
                items.push(item);
                localStorage.setItem('item', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('item'));
                items.push(item);
                localStorage.setItem('item', JSON.stringify(items));
            }
        },
        getItems: () => {
            let items;
            if (localStorage.getItem('item') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('item'));
            }
            return items;
        },
        updateItem: updateditem => {
            const items = JSON.parse(localStorage.getItem('item'));
            items.forEach((item, index) => {
                if (item.id === updateditem.id) {
                    items.splice(index, 1, updateditem);
                }
            });
            localStorage.setItem('item', JSON.stringify(items));
        },
        deleteItem: id => {
            const items = JSON.parse(localStorage.getItem('item'));
            items.forEach((item, index) => {
                if (item.id === id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('item', JSON.stringify(items));
        },
        clearItems: () => {
            localStorage.removeItem('item');
        }
    }
})();

// Item controller
const ItemCtrl = (function () {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        // items: [
        //     //{id: 0, name: 'Steak Meat', calories: 1200},
        //     //{id: 1, name: 'Cookie', calories: 500},
        //     //{id:2, name: 'Eggs', calories: 300}
        // ],
        items: StrCtrl.getItems(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        logData: () => {
            return data;
        },
        getItem: () => {
            return data.items;
        },
        addItem: (name, calories) => {
            let ID;

            let i = 0;
            data.items.forEach(item => i++);
            // generate ID

            if (i > 0) {
                ID = data.items[i - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            const newItem = new Item(ID, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        getTheItem: id => {
            let found = null;
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: (name, calories) => {
            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = parseInt(calories);
                    found = item;
                }
            });
            return found;
        },
        deleteItem: id => {

            const ids = data.items.map(item => {
                return item.id;
            });
            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },
        clearItems: () => {
            data.items = [];
        },
        setCurrentItem: obj => {
            data.currentItem = obj;
        },
        getCurrentItem: () => {
            return data.currentItem;
        },
        totalCal: () => {
            let total = 0;
            data.items.forEach(item => total += item.calories);
            data.totalCalories = total;
            return data.totalCalories;
        }
    }

})();
// UI controller
const UICtrl = (function () {

    const selectors = {
        listItem: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        clearBtn: '.clear-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCal: '.total-calories'
    }

    return {
        addItemToDom: items => {
            let output = '';
            items.forEach(item => {
                output += `
             <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="edit-item secondary-content"><i class="fa fa-pen"></i></a>
            </li>
             `;
            });

            document.querySelector(selectors.listItem).innerHTML = output;
        },
        addListItem: item => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="edit-item secondary-content"><i class="fa fa-pen"></i></a>
            `;
            document.querySelector(selectors.listItem).insertAdjacentElement('beforeend', li);
        },
        clearInput: () => {
            document.querySelector(selectors.itemNameInput).value = '';
            document.querySelector(selectors.itemCaloriesInput).value = '';
        },
        clearEditState: () => {
            UICtrl.clearInput();
            document.querySelector(selectors.updateBtn).style.display = 'none';
            document.querySelector(selectors.deleteBtn).style.display = 'none';
            document.querySelector(selectors.backBtn).style.display = 'none';
            document.querySelector(selectors.addBtn).style.display = 'block';

        },
        showEditSatet: () => {
            document.querySelector(selectors.updateBtn).style.display = 'inline';
            document.querySelector(selectors.deleteBtn).style.display = 'inline';
            document.querySelector(selectors.backBtn).style.display = 'inline';
            document.querySelector(selectors.addBtn).style.display = 'none';
        },
        showItemToEdit: obj => {
            document.querySelector(selectors.itemNameInput).value = obj.name;
            document.querySelector(selectors.itemCaloriesInput).value = obj.calories;
        },
        updateItem: item => {
            let lis = document.querySelectorAll(UICtrl.getSelectors().listItems);
            liArr = Array.from(lis);

            liArr.forEach(li => {
                if (li.id === `item-${item.id}`) {
                    document.querySelector(`#${li.id}`).innerHTML = `
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="edit-item secondary-content"><i class="fa fa-pen"></i></a>
                    `;
                }
            })
        },
        deleteItemList: id => {
            const slector = `#item-${id}`;
            const list = document.querySelector(slector);
            list.remove();
        },
        clearItems: () => {
            const Lis = document.querySelectorAll(selectors.listItems);
            const lis = Array.from(Lis);
            lis.forEach(li => {
                li.remove();
            });
        },
        alertMessage: (message, className) => {
            const div = document.createElement('div');
            div.className = `${className} alert`;
            div.appendChild(document.createTextNode(message));
            const container = document.querySelector('.mainContainer');
            container.insertBefore(div, document.querySelector('.card'));

            setTimeout(() => div.remove(), 1500);
        },
        getItemInput: () => {
            return itemsInput = {
                name: document.querySelector(selectors.itemNameInput).value,
                calories: document.querySelector(selectors.itemCaloriesInput).value
            }
        },
        hideList: () => {
            document.querySelector(selectors.listItem).remove();
        },
        addTotalCal: total => {
            document.querySelector(selectors.totalCal).textContent = total;
        },
        getSelectors: () => {
            return selectors;
        }
    }
})();
// App controller
const AppCtrl = (function (ItemCtrl, StrCtrl, UICtrl) {

    const loadEventListeners = function () {
        document.querySelector(UICtrl.getSelectors().addBtn).addEventListener('click', (e) => {
            const inputItem = UICtrl.getItemInput();
            if (inputItem.name !== '' && inputItem.calories !== '') {
                const newItem = ItemCtrl.addItem(inputItem.name, inputItem.calories);
                UICtrl.addListItem(newItem);
                UICtrl.clearInput();
                const totalCalories = ItemCtrl.totalCal();
                UICtrl.addTotalCal(totalCalories);
                StrCtrl.AddItemToLs(newItem);

            } else {
                UICtrl.alertMessage('input field cannot be empty!', 'full-width red lighten-2');
            }

            e.preventDefault();
        });

        document.querySelector(UICtrl.getSelectors().listItem).addEventListener('click', (e) => {
            if (e.target.classList.contains('fa-pen')) {
                const listID = e.target.parentElement.parentElement.id;
                const listIDArr = listID.split('-');
                const id = parseInt(listIDArr[1]);
                const itemObj = ItemCtrl.getTheItem(id);
                ItemCtrl.setCurrentItem(itemObj);
                const currentItem = ItemCtrl.getCurrentItem();
                UICtrl.showItemToEdit(currentItem);
                UICtrl.showEditSatet();
            }
            e.preventDefault();
        });
        document.querySelector(UICtrl.getSelectors().updateBtn).addEventListener('click', (e) => {
            const updatedItemInput = UICtrl.getItemInput();
            const newUpdatedItem = ItemCtrl.updateItem(updatedItemInput.name, updatedItemInput.calories);
            UICtrl.updateItem(newUpdatedItem);
            const totalCalories = ItemCtrl.totalCal();
            UICtrl.addTotalCal(totalCalories);
            StrCtrl.updateItem(newUpdatedItem);
            UICtrl.clearEditState();
            e.preventDefault();
        });
        document.querySelector(UICtrl.getSelectors().updateBtn).addEventListener('click', () => UICtrl.clearEditState());

        document.querySelector(UICtrl.getSelectors().deleteBtn).addEventListener('click', e => {
            const currentItem = ItemCtrl.getCurrentItem();
            ItemCtrl.deleteItem(currentItem.id);
            UICtrl.deleteItemList(currentItem.id);
            StrCtrl.deleteItem(currentItem.id);
            const totalCalories = ItemCtrl.totalCal();
            UICtrl.addTotalCal(totalCalories);
            UICtrl.clearEditState();

            e.preventDefault();
        });
        document.querySelector(UICtrl.getSelectors().clearBtn).addEventListener('click', e => {
            ItemCtrl.clearItems();
            UICtrl.clearItems();
            StrCtrl.clearItems();
            const totalCalories = ItemCtrl.totalCal();
            UICtrl.addTotalCal(totalCalories);

            e.preventDefault();
        });
        // disable Enter keyboard button 
        document.addEventListener('keypress', (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false
            }
        });
    }
    return {
        init: function () {
            // Clear edit state 
            UICtrl.clearEditState();

            const items = ItemCtrl.getItem();
            UICtrl.addItemToDom(items);

            const totalCalories = ItemCtrl.totalCal();
            UICtrl.addTotalCal(totalCalories);

            loadEventListeners();
        }
    }

})(ItemCtrl, StrCtrl, UICtrl);

AppCtrl.init();