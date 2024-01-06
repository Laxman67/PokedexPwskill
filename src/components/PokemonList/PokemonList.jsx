import { useEffect, useState } from "react";
import axios from "axios";
import Pokemon from "../Pokemon/Pokemon";
import "./PokemonList.css";

function PokemonList() {
  // const [pokemonList, setPokemonList] = useState([]);

  // const [isLoading, setIsLoading] = useState(true);

  // const [pokedex_url, setPokedex_url] = useState(
  //   "https://pokeapi.co/api/v2/pokemon"
  // );

  // const [nextUrl, setNextUrl] = useState("");
  // const [prevUrl, setPrevUrl] = useState("");

  const [pokemonListState, setPokemonListState] = useState({
    pokemonList: [],
    isLoading: true,
    pokedex_url: "https://pokeapi.co/api/v2/pokemon",
    nextUrl: "",
    prevUrl: "",
  });

  async function downloadPokemons() {
    // setIsLoading(true);
    setPokemonListState((state) => ({ ...state, isLoading: true }));

    const response = await axios.get(pokemonListState.pokedex_url);
    const pokemonResults = response.data.results; // we get the array of  pokemon  from results
    // Logging Data
    console.log(response.data);
    setPokemonListState((state) => ({
      ...state,
      nextUrl: response.data.next,
      prevUrl: response.data.previous,
    }));

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
    setPokemonListState((state) => ({
      ...state,
      pokemonList: PokeListResults,
      isLoading: false,
    }));
  }

  useEffect(() => {
    downloadPokemons();
  }, [pokemonListState.pokedex_url]);

  return (
    <div className="pokemon-list-wrapper">
      <div className="pokemon-wrapper">
        {pokemonListState.isLoading
          ? " Loading...."
          : pokemonListState.pokemonList.map((p) => (
              <Pokemon name={p.name} image={p.image} key={p.id} id={p.id} />
            ))}
      </div>
      {/* Buttons */}
      <div className="controls">
        <button
          disabled={pokemonListState.prevUrl == null}
          onClick={() => {
            const urlToSet = pokemonListState.prevUrl;

            setPokemonListState((state) => ({
              ...state,
              pokedex_url: urlToSet,
            }));
          }}
        >
          Prev
        </button>
        <button
          disabled={pokemonListState.nextUrl == null}
          onClick={() => {
            const urlToSet = pokemonListState.nextUrl;

            setPokemonListState((state) => ({
              ...state,
              pokedex_url: urlToSet,
            }));
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PokemonList;
