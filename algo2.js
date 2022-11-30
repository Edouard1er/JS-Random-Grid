class Grille{
    constructor(grid_size) {
		this.grid_size=grid_size
        this.block_place=[]
        this.chosen_place=[]
        this.neighbor_place=[]
	}

    constructPlace(block_place=[],amount_data,type="object") {
        let chosen_place=[]
        
        for (let each_data = 0; each_data < amount_data; each_data++) {
            var row, column=0
            var proposition={}
            var isInBlockPart=false
            do {
                row =Math.floor(Math.random() * this.grid_size)
                column =Math.floor(Math.random() * this.grid_size)
                proposition= new Case(row, column, type)
                if(block_place.filter(each_block=>each_block.row==row && each_block.column==column).length > 0)
                    isInBlockPart=true
                else
                    isInBlockPart=false
            }while(isInBlockPart || this.validationPlace(chosen_place,proposition))
            chosen_place.push(proposition)
        }
        return chosen_place
    }

    validationPlace(chosen_place=[], proposition) {
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

    canBeNeighbor(row=0, column=0, all_places=[], block_place=[]) {
        let neighbors=0
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

    createNeighbor() {
        let all_neighbors=[]
        this.chosen_place.forEach(current_place=>{
            let all_propositions=[
                {row:current_place.row, column:current_place.column + 1},
                {row:current_place.row, column:current_place.column - 1},
                {row:current_place.row + 1, column:current_place.column},
                {row:current_place.row - 1, column:current_place.column},
            ]
            let allReadyFind=false
            all_propositions.forEach(each_proposition => {
                if(each_proposition.row >=0 && each_proposition.column >=0 && each_proposition.row < this.grid_size && each_proposition.column < this.grid_size){
                    if(!allReadyFind && this.canBeNeighbor(each_proposition.row, each_proposition.column, this.chosen_place.concat(all_neighbors),this.block_place)){
                        all_neighbors.push(new Case(each_proposition.row,each_proposition.column,"neighbor"))
                        allReadyFind=true
                    }
                }
            });
        })
        return all_neighbors
    }

    setAllPlace() {
        let amount_free_place = this.grid_size - 1
        let amount_block = parseInt(this.grid_size/2)
        this.block_place=this.constructPlace([],amount_block, "block")
        this.chosen_place=this.constructPlace(this.block_place,amount_free_place)
        this.neighbor_place=this.createNeighbor()
    }
}

class HtmlCreateCode{
    constructor(grille){
        this.grille=grille
        this.grid_size=grille.grid_size
    }

    setGrille(grille){
        this.grille=grille
        this.grid_size=grille.grid_size
    }

    createBody(){
        document.body.innerHTML=`<div id='tirage'>
            <div id='intro'>
                <h1>Bienvenue sur l\'interface de tirage</h1>
                <input type="input" placeholder="Grid Size" name="grid_size" id='grid_size' value='4' required />
                <button id='launch-button'>Lancer</button>
            </div>
            <div id="my_grid"></div>
            <div id="info"></div>
        </div>`
    }

    createGrid() {
        if(this.grid_size && this.grid_size >= 4 && this.grid_size <= 25){
            document.getElementById("grid_size").value=this.grid_size
            let grid = document.getElementById("my_grid")
            grid.innerHTML=`<table align='center' id='grid_table'><tbody id='grid_body'></tbody></table>`
            let grid_body_html_code=``
            for (let row = 0; row < this.grid_size; row++) {
                grid_body_html_code += `<tr id='${row}'>`
                for (let column = 0; column <this.grid_size; column++) {
                    grid_body_html_code += `<td class='cell_data' id='${row+"_"+column}'></td>`
                }
                grid_body_html_code += `</tr>`
            }
            document.getElementById("grid_body").innerHTML=grid_body_html_code
        }else{
            alert("Veuillez choisir une taille entre 4 et 25 ")
        }
    }

    fullFillGrid(elements=[], color="green"){
        elements.forEach(item => {
            document.getElementById(item.row+"_"+item.column).style.backgroundColor=color
        });
    }

    showInfo(){
        document.getElementById("info").innerText="Le format de la grille est : "+this.grid_size+" x "+this.grid_size+ 
        "\nLe nombre d'objet est (en BLEU) : "+(this.grille.grid_size - 1)+
        "\nLe nombre de voisin est (en ROUGE) : "+this.grille.neighbor_place.length +
        "\nLe nombre de block (en VERT) : " +this.grille.block_place.length +
        (((this.grille.grid_size - 1) == this.grille.neighbor_place.length)?"\nC'est tirage dans lequel tous les objets trouvent chacun un voisin.":
        "\nDans ce tirage, tous les objets n'ont pas reussi a se trouver un voisin.")
    }
}

class Case{
    constructor (row, column, type){
        this.row=row
        this.column=column
        this.type=type
    }
    
    setRow(row){
        this.row=row
    }
    setColumn(column){
        this.column=column
    }
    setType(type){
        this.type=type
    }
    getNumber(grid_size){
        return (this.row * grid_size) + this.column
    }
}

class Main{
    constructor(grid_size=4){
        console.log("parseInt(grid_size)",parseInt(grid_size))
        if(parseInt(grid_size)){
            let grille = new Grille(parseInt(grid_size))
            grille.setAllPlace()

            let htmlCreateCode = new HtmlCreateCode(grille)
            htmlCreateCode.createBody()
            htmlCreateCode.createGrid()
            htmlCreateCode.fullFillGrid(grille.block_place, "red")
            htmlCreateCode.fullFillGrid(grille.chosen_place, "blue")
            htmlCreateCode.fullFillGrid(grille.neighbor_place, "green")
            htmlCreateCode.showInfo()
            document.getElementById("launch-button").addEventListener("click", ()=> {
                if(document.getElementById("grid_size").value && parseInt(document.getElementById("grid_size").value)){
                    new Main(parseInt(document.getElementById("grid_size").value))
                }else{
                    alert("Veuillez choisir une taille entre 4 et 25 ")
                }
            });
        }
    }
}

new Main()