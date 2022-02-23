import Layout from "./Layout/Layout";
import classes from './Home.module.css';

const Home = () => {


  return (
    <Layout title='home'>
      <div>
      <h1 className={classes.home__title}>
        Aktualizacje
      </h1>
      <i className={classes.data}>23.02.2022 r.</i>
      <p className={classes.content}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis purus libero, fermentum ut massa sit amet, mattis vulputate neque. Duis in hendrerit arcu. In dapibus, tortor a viverra mattis, nisl neque luctus odio, quis placerat magna odio mollis dui. In sed maximus odio, sit amet feugiat arcu. Ut et erat a nibh pulvinar finibus ut non ex. Nulla vestibulum scelerisque mi eu faucibus. Phasellus quis neque vel eros auctor sagittis. Morbi venenatis vehicula sodales. Curabitur quis lobortis nibh, non facilisis quam. Fusce faucibus sit amet lectus finibus congue.

Duis auctor hendrerit enim maximus venenatis. Praesent lacinia sollicitudin auctor. Proin fermentum pellentesque elementum. Curabitur rhoncus feugiat urna quis lobortis. Praesent semper dignissim ornare. Maecenas pretium mollis efficitur. Donec ac hendrerit sapien. Pellentesque tempus tincidunt pharetra.

Etiam placerat posuere tempor. Suspendisse et molestie orci. Donec cursus, velit at auctor hendrerit, dui erat rhoncus eros, id aliquam augue turpis et nisl. Nunc a eleifend quam. Vestibulum a est dapibus, congue leo sed, euismod dolor. Donec vel ipsum pharetra, pretium odio nec, volutpat turpis. Proin tristique tempus nulla sit amet pellentesque. Praesent at fringilla libero, quis tristique lorem. Sed blandit a ipsum vitae condimentum. Aenean ultricies purus eu diam congue rhoncus sit amet at nibh. Fusce nulla mi, gravida efficitur est ut, lobortis elementum ex. Nunc eu dapibus neque. Proin euismod nisi quis lectus laoreet, eu malesuada felis pretium. Sed posuere enim et fringilla cursus.

Phasellus vel erat eu purus elementum rhoncus. Suspendisse porttitor nulla nec eros condimentum porttitor. Proin scelerisque augue sed laoreet congue. Vivamus consectetur elementum urna a gravida. Nunc sed ligula eros. In consequat libero a augue vulputate accumsan. Duis quam arcu, gravida in volutpat et, sollicitudin vitae elit.

Donec a convallis magna, et luctus mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec tincidunt interdum libero, et aliquet magna vestibulum sed. Cras vehicula ex id tellus placerat luctus. Vivamus turpis quam, imperdiet sed est eu, convallis vulputate felis. Sed ut diam nec dolor mattis porttitor. Nulla id dolor id mi convallis fermentum. In a urna ultricies, consectetur ipsum sit amet, lobortis erat. Duis sollicitudin lorem nec lacus bibendum, ac mollis nunc pellentesque. Vestibulum et consequat leo. Donec vestibulum consectetur volutpat. Donec fringilla quam varius aliquet suscipit.</p>
      </div>
    </Layout>
  );
};
export default Home;
