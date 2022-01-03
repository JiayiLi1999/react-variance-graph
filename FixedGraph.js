import React from 'react';
import Item from './Item';
import './style.css'
import colorsDic from './colors'

class FixedGraph extends React.Component{
    constructor(props){
        super(props);
        this.pack = this.props.pack;
        if(this.props.data){
            if(!this.props.entities) this.pack = Object.assign({}, this.props.data);
            else{
                this.pack = {};
                for (let i=0; i<this.props.entities.length; i++) {
                    this.pack[this.props.entities[i]] = this.props.data[i];
                }
            }
        }
        this.length = this.pack ? Object.values(this.pack)[0].length : this.data[0].length;
        this.titles = this.props.titles;
        this.timeGap = this.props.timeGap ? this.props.timeGap : 2000;
        this.transition = this.props.transition ? this.props.transition: 500;
        this.delay = this.props.delay ? this.props.delay : 0;
        this.repeat = this.props.repeat ? this.props.repeat : true;
        if(this.props.colors){
            this.colors = [];
            for(let i=0;i<this.length;i++) this.colors[i] = this.props.colors[i%this.props.colors.length];
        }else{
            let colorTheme = this.props.theme && this.props.theme in colorsDic ? this.props.theme :'Red';
            this.colors = Array.from({length: this.length}, () =>  colorsDic[colorTheme][Math.floor(Math.random()*8)])
        }
        this.state={
            round: 0,
            maxAmount: this.getMax(0),
            started: true
        }
        this.nextOne = this.nextOne.bind(this);
    }
    componentDidMount(){
        if(this.state.started){
          const intervalId = setInterval(this.nextOne, this.timeGap + this.delay);
          this.setState({intervalId: intervalId});
        }
      }
  
    componentWillReceiveProps(nextProps) {
        if (nextProps.started) {
            const intervalId = setInterval(this.nextOne, this.timeGap + this.delay);
            this.setState({intervalId: intervalId});
        }
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    nextOne(){
        console.log(this.state.round)
        if(!this.repeat && this.state.round === this.pack.length-1 ){
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
        Object.values(this.pack).forEach(ele => currMax = Math.max(currMax,ele[round]));
        return currMax;
    }
    // getAttributes(entity){ }
    render(){
        console.log('state: ',this.state); 
        
        let List = Object.keys(this.pack).map((entity,index) => {
            return(
                <Item
                key={index}
                title={entity}
                pack={this.pack[entity][this.state.round]}
                maxAmount={this.state.maxAmount}
                color={this.colors[index]}
                transition={this.transition}
                delay={this.delay}
                titleStyle={this.props.titleStyle}
                descriptionStyle={this.props.descriptionStyle}
                barStyle={this.props.barStyle}
                />
            )
        });
        if(!this.pack) return null;
        return(
            <div>
                {this.titles && <div className='titleText' style={{...this.props.headStyle}}>{this.titles[this.state.round]}</div>}
                <div className='container'>
                    {List}
                </div>
            </div>
        );
    }
}

export default FixedGraph;