class Plant{/*initiate plant class*/
    constructor(name, growCondition, area){
        this.name=name;
        this.growCondition=growCondition;
        this.area = area;
    }
}

class PlantList {/*initiate Plantlist class with methods to create, delete, read, update info for user that connects to the MockAPI*/
    static url = 'https://662ce6620547cdcde9df6c82.mockapi.io/v1/plants';
    
    static getAllPlants() {
        return $.get(this.url);
    }

    static getPlant(id){
        return $.get(this.url + `/${id}`);
    }
    static addPlant(plant) {
        return $.post(this.url, plant);
    }

    static updatePlant(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify(plant),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deletePlant(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

    static addArea(area) {/*this isn't working...I've tried many different ways*/
        const data= {name: area};
        return $.ajax({
            url: this.url + `/${area}`,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json'
        });
    }
}

class DOMManager{/*initiate class and method to interact with the DOM*/
    static plants;

    static getAllPlants() {
        PlantList.getAllPlants().then(plants => this.render(plants));                       
    }

    static addPlant(name, growCondition, area){
        PlantList.addPlant(new Plant (name, growCondition, area))
            .then(() =>{
                return PlantList.getAllPlants();
            })
            .then((plants) => this.render(plants));
    }

    static addArea(id, name) {
        PlantList.addArea(id,name)
            .then(() => {
                return PlantList.getAllPlants();
            })
            .then((plants) => this.render(plants));
    }

    static deletePlant(id) {
        PlantList.deletePlant(id)
            .then(() => {
                return PlantList.getAllPlants();
            })
            .then((plants) => this.render(plants));
    }
    static render(plants) {/*add more elements to HTML div*/
        this.plants = plants;
        $('#app').empty();
        for (let plant of plants) {
            $('#app').prepend(/*create functioning button and form for showing information*/
                `<div id="${plant._id}" class="card">
                    <div class="card-header">
                        <h2>${plant.name}</h2>
                        <h7>${plant.growCondition}</h7><br>
                        <button class="btn btn-danger" id="delete-plant" onclick="DOMManager.deletePlant('${plant.id}')">Delete</button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${plant.id}-area-name" class="form-control" placeholder="Area name">
                                <button onclick="DOMManager.addArea('${plant._id}', $('#${plant._id}-area-name').val())" id="new-plant-area" class="btn btn-primary form-control">Add area</button>      
                            </div>
                        </div>
                    </div>
                </div><br>`
            );
        }
    }
}

$('#add-new-plant').click(()=>{/*method for button from HTML to add information for new plants whenever the button is clicked*/
    let name = $('#new-plant-name').val();
    let growCondition = $('#plant-grow-condition').val();
    let area = $('#new-plant-area').val();
    DOMManager.addPlant(name, growCondition,area);
    $('#new-plant-name').val('');
    $('#plant-grow-condition').val('');
    $('#new-plant-area').val('');
});
DOMManager.getAllPlants();/*show all plants*/