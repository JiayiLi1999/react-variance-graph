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

        let colors = []
        let colorTheme = this.props.colorTheme && this.props.colorTheme in colorsDic ? this.props.colorTheme :'Red';
        if(this.props.colors){
            for(let i=0;i<this.length;i++) colors[i] = this.props.colors[i%this.props.colors.length];
        }else{
            colors = Array.from({length: this.length}, () =>  colorsDic[colorTheme][Math.floor(Math.random()*8)])
        }

        this.state={
            round: 0,
            maxAmount: this.getMax(0),
            started: true, 
            length:this.length,
            timeGap : this.props.timeGap ? this.props.timeGap : 2000,
            transition : this.props.transition ? this.props.transition: 500,
            delay : this.props.delay ? this.props.delay : 0,
            repeat : this.props.repeat ? this.props.repeat : true,
            colors: colors,
            colorTheme : colorTheme,
        }
        this.nextOne = this.nextOne.bind(this);
    }
    componentDidMount(){        
        if(this.state.started){
          const intervalId = setInterval(this.nextOne, this.state.timeGap);
          this.setState({intervalId: intervalId});
        }
      }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.delay!==prevState.delay||nextProps.transition!==prevState.transition||nextProps.colorTheme!==prevState.colorTheme) {
          return {
            delay:nextProps.delay,
            transition:nextProps.transition,
            colorTheme:nextProps.colorTheme,
            timeGap:nextProps.timeGap,
            colors:Array.from({length: prevState.length}, () =>  colorsDic[nextProps.colorTheme?nextProps.colorTheme:'Red'][Math.floor(Math.random()*8)]),
          };
        }
        return null;
      }

    nextOne(){
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
    render(){
        let List = Object.keys(this.pack).map((entity,index) => {
            return(
                <Item
                key={index}
                title={entity}
                pack={this.pack[entity][this.state.round]}
                maxAmount={this.state.maxAmount}
                color={this.state.colors[index]}
                transition={this.state.transition}
                delay={this.state.delay}
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