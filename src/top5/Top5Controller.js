/**
 * Top5ListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class Top5Controller {
    constructor() {

    }

    setModel(initModel) {
        this.model = initModel;
        this.initHandlers();
    }

    initHandlers() {
        // SETUP THE TOOLBAR BUTTON HANDLERS
        document.getElementById("add-list-button").onmousedown = (event) => {
            let newList = this.model.addNewList("Untitled", ["?","?","?","?","?"]);            
            this.model.loadList(newList.id);
            this.model.saveLists();
        }
        document.getElementById("undo-button").onmousedown = (event) => {
            this.model.undo();
        }
        document.getElementById("redo-button").onmousedown = (event) => {
            this.model.redo();
        }
        document.getElementById("close-button").onmousedown = (event) => {
            this.model.unselectAll();
            this.model.view.clearWorkspace();
        }

        // SETUP THE ITEM HANDLERS
        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);
            let dragged;
            let dropped;

            // AND FOR TEXT EDITING
            item.ondblclick = (ev) => {
                if (this.model.hasCurrentList()) {
                    // CLEAR THE TEXT
                    item.innerHTML = "";

                    // ADD A TEXT FIELD
                    let textInput = document.createElement("input");
                    textInput.setAttribute("type", "text");
                    textInput.setAttribute("id", "item-text-input-" + i);
                    textInput.setAttribute("value", this.model.currentList.getItemAt(i-1));

                    item.appendChild(textInput);

                    textInput.ondblclick = (event) => {
                        this.ignoreParentClick(event);
                    }
                    textInput.onkeydown = (event) => {
                        if (event.key === 'Enter') {
                            this.model.addChangeItemTransaction(i-1, event.target.value);
                        }
                    }
                    textInput.onblur = (event) => {
                        this.model.restoreList();
                    }
                }
            }

            //DRAG AND DROP
            item.ondragstart = (ev) => {
                ev.dataTransfer.setData("text", i);
            }

            item.ondragover = (ev) => {
                ev.preventDefault();
                dropped = i;
            }

            item.ondrop = (ev) => {
                ev.preventDefault();
                var dragged = ev.dataTransfer.getData("text");
                this.model.addMoveItemTransaction(dragged-1, dropped-1);

            }
        }
    }

    registerListSelectHandlers(id) {
        // FOR SELECTING THE LIST
        document.getElementById("top5-list-" + id).onmousedown = (event) => {
            this.model.unselectAll();

            // GET THE SELECTED LIST
            this.model.loadList(id);
        }

        //TEXT EDITING
        document.getElementById("top5-list-" + id).ondblclick = (event) => {
            let list = document.getElementById("top5-list-" + id);
            list.innerHTML = "";

            let textInput = document.createElement("input");
            textInput.setAttribute("type", "text");
            textInput.setAttribute("id", id);
            textInput.setAttribute("value", this.model.currentList.getName());

            list.appendChild(textInput);

            /*textInput.ondblclick = (event) => {
                this.ignoreParentClick(event);
            }*/
            textInput.onkeydown = (event) => {
                if (event.key === 'Enter') {
                    this.model.currentList.setName(textInput.value);
                    this.model.saveLists();
                    list.removeChild(textInput);
                    list.innerHTML = this.model.currentList.getName();
                    this.model.sortLists();
                }
            }
            textInput.onblur = (event) => {
                this.model.restoreList();
                list.removeChild(textInput);
                list.innerHTML = this.model.currentList.getName();
            }

        }

        document.getElementById("top5-list-" + id).onmouseover = (event) => {
            this.model.view.hoverList(id);
        }
        document.getElementById("top5-list-" + id).onmouseout = (event) => {
            this.model.view.unhoverList(id);
        }

        // FOR DELETING THE LIST
        document.getElementById("delete-list-" + id).onmousedown = (event) => {
            this.ignoreParentClick(event);
            // VERIFY THAT THE USER REALLY WANTS TO DELETE THE LIST
            let modal = document.getElementById("delete-modal");
            this.listToDeleteIndex = this.model.getListIndex(id);
            let listName = this.model.getList(id).getName();
            let deleteSpan = document.getElementById("delete-list-span");
            deleteSpan.innerHTML = "";
            deleteSpan.appendChild(document.createTextNode(listName));
            modal.classList.add("is-visible");

            document.getElementById("dialog-confirm-button").onmousedown = (event) => {
                this.model.deleteList(this.listToDeleteIndex);
                modal.classList.remove("is-visible");
            }

            document.getElementById("dialog-cancel-button").onmousedown = (event) => {
                modal.classList.remove("is-visible");
            }
        }


    }

    ignoreParentClick(event) {
        event.cancelBubble = true;
        if (event.stopPropagation) event.stopPropagation();
    }
}