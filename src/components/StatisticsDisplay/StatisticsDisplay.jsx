import './StatisticsDisplay.css'
import { useEffect, useState } from 'react';
import Statistics from '../../classes/Statistics';

export default function StatisticsDisplay({ sideMenu = false }) {

  const [statisticState, setStatisticState] = useState({
    timePickUp: 0,
    longestPickUpTime: 0,
    shortestPickUpTime: 0,
    deviationPickUpTime: 0,
    timeDelivery: 0,
    longestDeliveryTime: 0,
    shortestDeliveryTime: 0,
    deviationDeliveryTime: 0,
  });

  useEffect(() => {
      userPickUpListener();
      userDeliveryListener();
    }, [])

  const userPickUpListener = () => {
    Statistics.addEventListener('userTimeToPickUpListener', (userTimes) => {
    const sum = userTimes.reduce((partialSum, a) => partialSum + a, 0);
    const mediumTime = sum/userTimes.length;
      
    const pickUpTime = Math.round((mediumTime) * 60).toLocaleString('pt-BR', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    let longestTime = Math.max.apply(Math, userTimes);
    longestTime = Math.round((longestTime) * 60).toLocaleString('pt-BR', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })

    let shortestTime = Math.min.apply(Math, userTimes);
    shortestTime = Math.round((shortestTime) * 60).toLocaleString('pt-BR', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })

    let deviation = calcDeviation(userTimes);
      deviation = Math.round(deviation).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    })

    setStatisticState(prevState => ({...prevState, 
        timePickUp: pickUpTime,
        longestPickUpTime: longestTime,
        deviationPickUpTime: deviation,
        shortestPickUpTime: shortestTime }))
    })
  }

  const userDeliveryListener = () => {
    Statistics.addEventListener('userTimeToDeliveryListener', (userTimes) => {
      const sum = userTimes.reduce((partialSum, a) => partialSum + a, 0);
      const mediumTime = sum/userTimes.length;

      const deliveryTime = Math.round((mediumTime) * 60).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });

      let longestTime = Math.max.apply(Math, userTimes);
      longestTime = Math.round((longestTime) * 60).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
  
      let shortestTime = Math.min.apply(Math, userTimes);
      shortestTime = Math.round((shortestTime) * 60).toLocaleString('pt-BR', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
  
      let deviation = calcDeviation(userTimes);
        deviation = Math.round(deviation).toLocaleString('pt-BR', {
          minimumIntegerDigits: 2,
          useGrouping: false,
      })

      setStatisticState(prevState => ({...prevState, 
        timeDelivery: deliveryTime,
        longestDeliveryTime: longestTime,
        deviationDeliveryTime: deviation,
        shortestDeliveryTime: shortestTime }))

    })
  }

  const calcDeviation = (arr) => {
    const data = arr.map(element => Math.round((element) * 60).toLocaleString('pt-BR', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }))
    let media = data.reduce((total, valor) => total+valor/data.length, 0);
    let variancia = data.reduce((total, valor) => total + Math.pow(media - valor, 2)/data.length, 0);
    return Math.sqrt(variancia);
  }

  const showStatistic = (title, content) => {
    if (content !== null || content !== undefined) {
      return(
        <section className="statistic-line">
          <span className="statistic-title">{title}</span>
          <span>{content}</span>
        </section>
      );
    }
    return <></>;
  }

  if (sideMenu) {
    return (
      <div className="sidemenu-statistics">
        {showStatistic("Tempo médio para embarque:", `${statisticState.timePickUp}m`)}
        {showStatistic("Maior tempo de espera para embarque:", `${statisticState.longestPickUpTime}m`)}
        {showStatistic("Menor tempo de espera para embarque:", `${statisticState.shortestPickUpTime}m`)}
        {showStatistic("Desvio padrão tempo para embarque:", `${statisticState.deviationPickUpTime}`)}
        {showStatistic("Tempo médio de viagem:", `${statisticState.timeDelivery}m`)}
        {showStatistic("Maior tempo de viagem:", `${statisticState.longestDeliveryTime}m`)}
        {showStatistic("Menor tempo de viagem:", `${statisticState.shortestDeliveryTime}m`)}
        {showStatistic("Desvio padrão tempo de viagem:", `${statisticState.deviationDeliveryTime}`)}
      </div>
    )
  }
  return (
    <div className="statistics">
      {showStatistic("T médio embarque", `${statisticState.timePickUp}m`)}
      {showStatistic("T médio viagem", `${statisticState.timeDelivery}m`)}
    </div>
  )
}
