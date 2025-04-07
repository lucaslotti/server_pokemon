const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/pokemon/:name', async (req, res) => {
  const name = req.params.name.toLowerCase();

  try {
    const { data: pokemonData } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const { data: speciesData } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const typeUrl = pokemonData.types[0].type.url;
    const { data: typeData } = await axios.get(typeUrl);
    const abilityUrl = pokemonData.abilities[0].ability.url;
    const { data: abilityData } = await axios.get(abilityUrl);
    const evoChainUrl = speciesData.evolution_chain.url;
    const { data: evoData } = await axios.get(evoChainUrl);

    let nextEvo = 'Nenhuma';
    const chain = evoData.chain;
    if (chain.species.name === name && chain.evolves_to.length > 0) {
      nextEvo = chain.evolves_to[0].species.name;
    } else {
      for (let evo of chain.evolves_to) {
        if (evo.species.name === name && evo.evolves_to.length > 0) {
          nextEvo = evo.evolves_to[0].species.name;
        }
      }
    }

    const result = {
      name: pokemonData.name,
      height: pokemonData.height,
      weight: pokemonData.weight,
      types: pokemonData.types.map(t => t.type.name),
      abilities: pokemonData.abilities.map(a => a.ability.name),
      abilityDescription: abilityData.effect_entries.find(e => e.language.name === 'en')?.short_effect || 'N/A',
      flavorText: speciesData.flavor_text_entries.find(e => e.language.name === 'en')?.flavor_text || 'N/A',
      color: speciesData.color.name,
      nextEvolution: nextEvo,
      sprite: pokemonData.sprites.front_default,
      typeInfo: {
        name: typeData.name,
        doubleDamageFrom: typeData.damage_relations.double_damage_from.map(t => t.name)
      }
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dados do Pokémon' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
