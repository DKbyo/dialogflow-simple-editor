import './App.css';
import Graph from "react-graph-vis";
import { useEffect, useState } from 'react';
import {ParserContent} from './utils/contentful'
function App() {
  const [graph,setGraph] = useState(null)
  useEffect(() => {
    // Actualiza el título del documento usando la API del navegador
    const fetchData = async ()=>{
      const parser = new ParserContent({url:'/data/content.json'})
      const graph = await parser.parse()
      console.log("Loading")
      setGraph(graph[0])
    }
    fetchData()
  },[]);

  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#000000"
    },
    height: window.innerHeight,
    manipulation: {
      enabled: true,
      initiallyActive: true,
      editNode: (nodeData,callback)=> {
        window.open(`https://app.contentful.com/spaces/8nz3iqnj48cd/entries/${nodeData.id}`);
        callback(nodeData);
      }
    },
  };

  const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };
  if (graph){
    return (    
      <Graph
        graph={graph}
        options={options}
        
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
        }}
      />
    );
  }
  return null;
}

export default App;
