const animalTab = document.getElementById('tb-nav');

const outputLabel1 = document.getElementById('lbl-home');
const outputLabel2 = document.getElementById('lbl-planner');
const outputLabel3 = document.getElementById('lbl-settings');
const outputLabel4 = document.getElementById('lbl-profile');


let outputLabelArray = [outputLabel1, outputLabel2, outputLabel3, outputLabel4];

let numberOfChanges = 0;

animalTab.addEventListener('ionTabsDidChange', recordChange);

function recordChange(){

    console.log("test");

    for (let outputLabel of outputLabelArray){
        outputLabel.textContent = "Number of changes is " + numberOfChanges;
    }
    numberOfChanges++;
}
