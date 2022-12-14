function createBody(){
    document.body.innerHTML=`<div id='tirage'>
        <div id='intro'>
            <h1>Bienvenue sur l\'interface de tirage</h1>
            <input type="input" placeholder="Grid Size" name="grid_size" id='grid_size' value='4' required />
            <button id='launch-button'>Lancer</button>
        </div>
        <div id="my_grid"></div>
        <div id="info"></div>
    </div>`
    document.getElementById("launch-button").addEventListener("click", function() {
        let grid_size = document.getElementById("grid_size").value
        if(parseInt(grid_size) && ((parseInt(grid_size) >= 4) && (parseInt(grid_size) <= 25))){
            createGrid(grid_size)
        }else{
            alert("Veuillez choisir une taille entre 4 et 25 ")
        }
    });
}

function createGrid(grid_size=6) {
    document.getElementById("grid_size").value=grid_size
    let grid = document.getElementById("my_grid")
    grid.innerHTML=`<table align='center' id='grid_table'><tbody id='grid_body'></tbody></table>`
    let grid_body_html_code=``
    for (let row = 0; row < grid_size; row++) {
        grid_body_html_code += `<tr id='${row}'>`
        for (let column = 0; column < grid_size; column++) {
            grid_body_html_code += `<td class='cell_data' id='${row+"_"+column}'></td>`
        }
        grid_body_html_code += `</tr>`
    }
    document.getElementById("grid_body").innerHTML=grid_body_html_code
    populateRandomData(grid_size)
}

function constructData(grid_size,amount_data,block_place=[],isBlock=false) {
    let chosen_place=[]
    for (let each_data = 0; each_data < amount_data; each_data++) {
        var row, column=0
        var proposition={}
        var isInBlockPart=false
        do {
            row =Math.floor(Math.random() * grid_size)
            column =Math.floor(Math.random() * grid_size)
            proposition={"row":row, "column":column}
            if(block_place.filter(each_block=>each_block.row==row && each_block.column==column).length > 0)
                isInBlockPart=true
            else
                isInBlockPart=false
        }while(isInBlockPart || validationPlace(chosen_place,proposition))
        chosen_place.push(proposition)
        if(isBlock)
            document.getElementById(row+"_"+column).style.backgroundColor="green"
        else
            document.getElementById(row+"_"+column).style.backgroundColor="blue"
    }
    return chosen_place
}

function populateRandomData(grid_size=6) {
    let amount_data = grid_size - 1
    let amount_block = parseInt(grid_size/2)
    let block_place=constructData(grid_size,amount_block,[], true)
    let chosen_place=constructData(grid_size,amount_data,block_place)
    let amount_neighbor=populateNeighbor(chosen_place,block_place,grid_size)
    document.getElementById("info").innerText="Le format de la grille est : "+grid_size+"x"+grid_size+ 
    "\nLe nombre d'objet est (en BLEU) : "+amount_data+
    "\nLe nombre de voisin est (en ROUGE) : "+amount_neighbor +
    "\nLe nombre de block (en VERT) : " +amount_block +
    ((amount_data == amount_neighbor)?"\nC'est tirage dans lequel tous les objets trouvent chacun un voisin.":
    "\nDans ce tirage, tous les objets n'ont pas reussi a se trouver un voisin.")
}

function validationPlace(chosen_place=[], proposition) {
    if(chosen_place.length == 0){
        return false
    }else{
        let position_test=chosen_place.filter(each_place=>
            (   
                each_place.row == proposition.row 
                && 
                (each_place.column==proposition.column || each_place.column==proposition.column -1 || each_place.column==proposition.column + 1)
            )
            ||
            (   
                each_place.column == proposition.column 
                && 
                (each_place.row==proposition.row || each_place.row==proposition.row -1 || each_place.row==proposition.row + 1)
            )
        )
        if(position_test.length == 0)
            return false
        else
            return true
    }
}

function populateNeighbor(chosen_place=[],block_place=[], grid_size=6) {
    let all_neighbors=0
    let all_places=chosen_place
    chosen_place.forEach(current_place=>{
        let all_propositions=[
            {row:current_place.row, column:current_place.column + 1},
            {row:current_place.row, column:current_place.column - 1},
            {row:current_place.row + 1, column:current_place.column},
            {row:current_place.row - 1, column:current_place.column},
        ]
        let allReadyFind=false
        all_propositions.forEach(each_proposition => {
            if(each_proposition.row >=0 && each_proposition.column >=0 && each_proposition.row < grid_size && each_proposition.column < grid_size){
                if(!allReadyFind && canBeNeighbor(each_proposition.row, each_proposition.column, all_places,block_place)){
                    document.getElementById(each_proposition.row+"_"+each_proposition.column).style.backgroundColor="red"
                    all_places.push({row:each_proposition.row, column:each_proposition.column})
                    allReadyFind=true
                    all_neighbors ++
                }
            }
        });
    })
    return all_neighbors
}

function canBeNeighbor(row=0, column=0, all_places=[], block_place=[]) {
    if(block_place.filter(each_block=>each_block.row==row && each_block.column==column).length > 0){
        return false
    }
    neighbors=all_places.filter(other_place=>
        (
            other_place.row == row
            && 
            Math.abs(other_place.column - column)==1
        )
        ||
        (
            other_place.column == column
            && 
            Math.abs(other_place.row - row)==1
        )
    )
    if(neighbors.length == 1){
        return true
    }else{
        return false
    }
}
createBody()
createGrid(4)