import React from 'react';
import Item from './Item';
import './style.css'
import colorsDic from './colors'

class FixedGraph extends React.Component{
    constructor(props){
        super(props);
        this.data = this.props.data;
        this.entities = this.props.entities;
        this.titles = this.props.titles;
        this.timer = this.props.timer ? this.props.timer : 1000;
        this.delay = this.props.delay ? this.props.delay : 0;
        this.repeat = this.props.repeat ? this.props.repeat : true;
        this.length = Object.values(this.data)[0].length;
        this.colorTheme = this.props.theme && this.props.theme in colorsDic ? this.props.theme :'Red';
        this.colors = Array.from({length: this.length}, () =>  colorsDic[this.colorTheme][Math.floor(Math.random()*8)])
        this.state={
            round: 0,
            maxAmount: this.getMax(0),
            started: true
        }
        this.nextOne = this.nextOne.bind(this);
    }
    componentDidMount(){
        if(this.state.started){
          const intervalId = setInterval(this.nextOne, this.timer + this.delay);
          this.setState({intervalId: intervalId});
        }
      }
  
    componentWillReceiveProps(nextProps) {
        if (nextProps.started) {
            const intervalId = setInterval(this.nextOne, this.timer + this.delay);
            this.setState({intervalId: intervalId});
        }
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    nextOne(){
        console.log(this.state.round)
        if(!this.repeat && this.state.round === this.data.length-1 ){
            clearInterval(this.state.intervalId);
            return;
        }
        this.setState(prevState=>{
            return{
                round:(prevState.round+1)%this.length,
                maxAmount:this.getMax((prevState.round+1)%this.length),
            }
        })
    }

    getMax(round){
        let currMax = Number.MIN_VALUE;
        Object.values(this.data).forEach(ele => currMax = Math.max(currMax,ele[round]));
        return currMax;
    }
    // getAttributes(entity){ }
    render(){
        console.log('state: ',this.state); 
        
        let List = Object.keys(this.props.data).map((entity,index) => {
            return(
                <Item
                key={index}
                title={entity}
                data={this.data[entity][this.state.round]}
                maxAmount={this.state.maxAmount}
                color={this.colors[index]}
                />
            )
        });
        if(!this.data) return null;
        return(
            <div>
                {this.titles && <div className='titleText'>{this.titles[this.state.round]}</div>}
                <div className='container'>
                    {List}
                </div>
            </div>
        );
    }
}

export default FixedGraph;