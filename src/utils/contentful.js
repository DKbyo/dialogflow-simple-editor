import axios from 'axios'


class Response{
    
    constructor({id,text, chips}){
        this.id = id
        this.text = text
        this.chips = chips
    }
    get node(){
        return {
            id:this.id,            
            label: this.text,
            type: "response",
            shape: "box",      
            color: "#FFCFCF",      
        }
    }
}

class Chip{
    constructor({id,text, location, url}){
        this.id = id
        this.text = text;
        if(url){
            this.url = url
            this.endNode = true
        }else if (location){
            this.location = location;        
            this.endNode = false
        }else{
            this.endNode = false
        }
    }
    get node(){
        return {
            id: this.id,
            
            label: this.text,
            type: "chip",            
            shape: "box",
            

        }
    }
}

class Generator{
    constructor(){
        this.nodes = []
        this.edges = []
        this.nodeMap = {}
    }
    build=(node)=>{
        const newNode = node.node        
        if(!this.nodeMap[newNode.id]){
            this.addNode(newNode)            
            node.chips?.forEach(this.processChip(node))                 
            return newNode
        }
    }
    addNode=(newNode)=>{
        this.nodes.push(newNode)
        this.nodeMap[newNode.id] = newNode
    }
    processChip=(parentNode)=>{
        return (chip)=>{
            const newNode = chip.node
            this.addNode(newNode)
            this.edges.push({from: parentNode.id, to: newNode.id})
            if(chip.location){
                const builtNode = this.build(chip.location)
                if(builtNode){
                    this.edges.push({from: newNode.id, to: builtNode.id})
                }
            }
        }
    }
    get graph(){
        return {
            nodes: this.nodes,
            edges: this.edges
        }
    }
}
class ParserContent{
    constructor({url}){
        this.url = url
        this.nodeMap = {}
    }
    async parse(){
        const response = await axios.get('/data/content.json')
        const data = response.data    
        const graphs = data.map((element)=>{
            const mainNode = this.processResponse(element)
            const generator = new Generator()
            generator.build(mainNode);   
            return generator.graph 
        });
        console.log(graphs[0])
        return graphs
    }
    processResponse=(element)=>{
        if(element && !this.nodeMap[element.sys.id]){
            return new Response({id: element.sys.id, text:element.fields.text, chips: element.fields.chips?.map(this.processChips)})
        }else if(element && this.nodeMap[element.sys.id]){
            return new Response({id: element.sys.id})
        }
    }
    processChips=(chip)=>{
        return new Chip({id: chip.sys.id, text: chip.fields.text, location: this.processResponse(chip.fields.location), url: chip.fields.url})
    }
}
export {ParserContent}