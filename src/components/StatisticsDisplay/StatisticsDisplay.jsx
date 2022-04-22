import './StatisticsDisplay.css'
import { useEffect, useState } from 'react';
import Statistics from '../../classes/Statistics';

export default function StatisticsDisplay() {

  const [timePickUp, setTimePickUp] = useState(0)
  const [timeDelivery, setTimeDelivery] = useState(0)
  const [longestPickUpTime, setLongestPickUpTime] = useState(0)
  const [deviationPickUpTime, setDeviationPickUpTime] = useState(0);

  // Se inscreve para manter o tempo atualizado
  useEffect(() => {
      userPickUpListener();
      userDeliveryListener();
    }, [])

  const userPickUpListener = () => {
    Statistics.addEventListener('userTimeToPickUpListener', (userTimes) => {
      const sum = userTimes.reduce((partialSum, a) => partialSum + a, 0);
      const mediumTime = sum/userTimes.length;
      
      setTimePickUp(
          Math.round((mediumTime) * 60).toLocaleString('pt-BR', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
      )

      const longestTime = Math.max.apply(Math, userTimes);
      setLongestPickUpTime(
        Math.round((longestTime) * 60).toLocaleString('pt-BR', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })
    )

        const deviation = calcDeviation(userTimes);
        setDeviationPickUpTime(          
          Math.round(deviation).toLocaleString('pt-BR', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        }))
    })
  }

  const userDeliveryListener = () => {
    Statistics.addEventListener('userTimeToDeliveryListener', (userTimes) => {
      const sum = userTimes.reduce((partialSum, a) => partialSum + a, 0);
      const mediumTime = sum/userTimes.length;

      setTimeDelivery(
          Math.round((mediumTime) * 60).toLocaleString('pt-BR', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          })
      )
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
        <section>
          <span>{title}</span>
          <span>{content}</span>
        </section>
      );
    }
    return <></>;
  }

  return (
    <div className="statistics">
      {showStatistic("Carros", 0)}
      {showStatistic("Tempo médio para embarque", `${timePickUp}m`)}
      {showStatistic("Tempo médio viagem", `${timeDelivery}m`)}
      {showStatistic("Maior tempo de espera", `${longestPickUpTime}m`)}
      {showStatistic("Desvio padrão tempo de espera", `${deviationPickUpTime}`)}
    </div>
  )
}
