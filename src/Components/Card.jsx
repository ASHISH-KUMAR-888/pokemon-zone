import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Card = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const scroll = useRef(null);
  const [uri, setUri] = useState("https://pokeapi.co/api/v2/pokemon?limit=150");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");

  const types = [
    "normal",
    "fighting",
    "flying",
    "poison",
    "ground",
    "rock",
    "bug",
    "ghost",
    "steel",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ];

  const fetchPokemons = async (pageNum) => {
    setLoading(true);
    try {
      const offset = (pageNum - 1) * 20;
      const res = await axios.get(uri);

      const pokemonData = await Promise.all(
        res.data.results.map(async (pokemon) => {
          const pokeDetails = await axios.get(pokemon.url);
          return {
            name: pokeDetails.data.name,
            id: pokeDetails.data.id,
            image: pokeDetails.data.sprites.other.home.front_default,
            height: pokeDetails.data.height,
            weight: pokeDetails.data.weight,
            ability: pokeDetails.data.abilities.map((ab) => ab.ability.name),
            type: pokeDetails.data.types.map((ty) => ty.type.name),
          };
        })
      );
      setData(pokemonData);
    } catch (err) {
      console.error("Error fetching Pokemon:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page, uri]);

  const aura = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  let filteredPokemons = data.filter((pokemon) => {
    const search = pokemon.name.toLowerCase().includes(searchTerm);
    const filter = selectedType ? pokemon.type.includes(selectedType) : true;

    return search && filter;
  });

  return (
    <>
      <div
        className="flex justify-center items-center gap-[25px] flex-wrap"
        ref={scroll}
      >
        <input
          className="search-OPtion"
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <select
          className="bg-black text-white font-black px-[3px] py-[4px] cursor-pointer"
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option
            className="bg-black text-white font-[300] text-center cursor-pointer"
            value=""
          >
            -- Select Type --
          </option>
          {types.map((type) => (
            <option
              className="bg-black text-white font-[700] text-center cursor-pointer"
              key={type}
              value={type}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-[30px] mb-[50px] px-[20px] grid gap-y-[50px] md:mt-[60px]  md:grid-cols-2 gap-[30px] lg:grid-cols-3">
        {loading ? (
          <p
            className="text-[50px] text-white font-black text-center w-screen"
            style={{ filter: `drop-shadow(1px 1px 10px ${aura()})` }}
          >
            Loading....
          </p>
        ) : filteredPokemons.length > 0 ? (
          filteredPokemons.map((item, ii) => {
            return (
              <div className="h-max" key={ii}>
                <div className="h-[65%] flex justify-center items-center tick">
                  <img
                    className={`h-full imu hover:drop-shadow-[1px_1px_5px_red]`}
                    style={{ filter: `drop-shadow(1px 1px 10px ${aura()})` }}
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="h-[35%] flex flex-col justify-between gap-y-[5px] relative h-max">
                  <div className="absolute h-full w-full bg-[#3C3E44] z-[-2]"></div>

                  <div className="stack pt-[10px] mt-[15px] md:mt-[20px]">
                    <p className="text-white font-black tracking-[1px] text-[7vw] md:text-[2vw] capitalize">
                      {item.name}
                    </p>
                    <p className="text-[#FBC02D] font-[600] fontu"></p>
                  </div>

                  <div className="stack">
                    <p className="text-[#F5F5F5] font-[600] fontu">Id:</p>
                    <p className="text-[#FBC02D] font-[600] fontu">{item.id}</p>
                  </div>

                  <div className="stack">
                    <p className="text-[#F5F5F5] font-[600] fontu">Height:</p>
                    <p className="text-[#FBC02D] font-[600] fontu">
                      {item.height}
                    </p>
                  </div>

                  <div className="stack">
                    <p className="text-[#F5F5F5] font-[600] fontu">Weight:</p>
                    <p className="text-[#FBC02D] font-[600] fontu">
                      {item.weight}
                    </p>
                  </div>

                  <div className="stack">
                    <p className="text-[#F5F5F5] font-[600] fontu">Types:</p>
                    <p className="text-[#FBC02D] font-[600] fontu">
                      {item.type.join(" | ")}
                    </p>
                  </div>

                  <div className="stack pb-[10px] mb-[15px] md:mb-[20px]">
                    <p className="text-[#F5F5F5] font-[600] fontu">
                      Abilities:
                    </p>
                    <p className="text-[#FBC02D] font-[600] fontu">
                      {item.ability.join(" | ")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="w-screen text-white text-[30px] font-black tracking-[2px] text-center">
            No Pokemon found.
          </p>
        )}
      </div>
    </>
  );
};

export default Card;
