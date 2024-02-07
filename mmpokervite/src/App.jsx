import './App.css';
import Navigation from './components/Navigation';
import axios from 'axios';

function App() {

  const apiCall = () => {
    axios.get('http://localhost:8080').then((data) => {
      console.log(data);
    });
  }

  return (
    <div>
      <button onClick={apiCall}>Explore</button>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio recusandae, cumque illum sed suscipit quidem. Quisquam, sunt voluptatum odio voluptate quis consequatur. Earum modi, enim distinctio cumque nemo quis adipisci!
        Recusandae, voluptas tenetur! Vero magnam repudiandae temporibus delectus iusto animi, voluptas quam minus voluptatum cupiditate alias aliquid perspiciatis. Eaque aspernatur minus laboriosam ullam, eligendi vel quod itaque nulla qui dolore?
        Autem mollitia facilis explicabo vitae deleniti fuga in et repudiandae minima harum? Et nihil ratione deleniti doloremque, maxime sed fuga nemo culpa, magnam error corrupti earum blanditiis vel vero nostrum.
        Id, tempora repellendus atque ducimus molestias, illum aliquid quidem aut, labore quae quisquam sed alias voluptatem quis velit ad veritatis! Placeat totam nobis accusamus dignissimos ducimus! Doloribus iure ipsam necessitatibus.
        Nesciunt nulla error pariatur nemo ipsa officia explicabo magni quae recusandae rem minima placeat repellendus doloremque consectetur, accusamus unde aut ab dolores a optio nihil temporibus voluptate repellat sit. Aspernatur!
        Necessitatibus tenetur vero, fugiat, illo eaque aliquid quasi quisquam deleniti sapiente laudantium earum accusantium eius labore mollitia culpa, ipsa vitae autem dicta porro! Sint doloribus fuga perferendis? Consequuntur, obcaecati non!
        Culpa veniam, quod expedita quisquam distinctio autem sint vel totam odit repudiandae consectetur at voluptates aliquid omnis laudantium repellendus, officiis fugit asperiores iure voluptatibus illo quasi! Iure mollitia aspernatur alias.
        A ab amet, aperiam numquam sunt error repellat porro ipsum ex nobis alias ducimus praesentium totam nemo exercitationem quaerat. Ex quae soluta ut facilis laboriosam mollitia possimus maxime nihil veniam?
        Asperiores aperiam adipisci totam veritatis animi quis magnam culpa corporis exercitationem voluptate maxime debitis eos tenetur, voluptatibus consectetur necessitatibus laudantium et. Earum nemo nulla ad voluptatem quasi ipsam dolorem doloremque!
        Amet sunt animi ab voluptatum inventore omnis. Magnam amet dignissimos cum laboriosam itaque accusantium sed velit culpa. Facilis, repudiandae at, sit natus nostrum sapiente nihil facere aliquid optio omnis molestias.</p>
    </div>
  )
}

export default App
