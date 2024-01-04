import { useEffect, useState } from "react";
import axios from "axios";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

function PokemonList() {
  const [pokemonList, setPokemonList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [pokedex_url, setPokedex_url] = useState(
    "https://pokeapi.co/api/v2/pokemon"
  );

  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");

  async function downloadPokemons() {
    setIsLoading(true);
    const response = await axios.get(pokedex_url);
    const pokemonResults = response.data.results; // we get the array of  pokemon  from results
    // Logging Data
    console.log(response.data);
    setNextUrl(response.data.next);
    setPrevUrl(response.data.previous);

    const pokemonResultPromise = pokemonResults.map((pokemon) =>
      axios.get(pokemon.url)
    );

    const pokemonData = await axios.all(pokemonResultPromise);

    const PokeListResults = pokemonData.map((pokeData) => {
      const pokemon = pokeData.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other.dream_world.front_default,
        types: pokemon.types,
      };
    });

    console.log(PokeListResults);
    setPokemonList(PokeListResults);
    setIsLoading(false);
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokedex_url]);

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
        {isLoading
          ? " Loading...."
          : pokemonList.map((p) => (
              <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
            ))}
      </div>
      {/* Buttons */}
      <div className="controls">
        <button
          disabled={prevUrl == null}
          onClick={() => setPokedex_url(prevUrl)}
        >
          Prev
        </button>
        <button
          disabled={nextUrl == null}
          onClick={() => setPokedex_url(nextUrl)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;
