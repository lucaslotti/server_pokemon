async function buscarPokemon(name) {
    try {
      const res = await fetch(`/pokemon/${name}`);
      const data = await res.json();
  
      document.getElementById('pokemonImage').src = data.sprite;
      document.getElementById('pokemonName').textContent = data.name;
      document.getElementById('pokemonTypes').textContent = data.types.join(', ');
      document.getElementById('pokemonHeight').textContent = (data.height / 10).toFixed(1);
      document.getElementById('pokemonWeight').textContent = (data.weight / 10).toFixed(1);
      document.getElementById('pokemonSkills').textContent = data.abilities.join(', ');
      document.getElementById('pokemonEvo').textContent = data.nextEvolution || 'Nenhuma';
  
    } catch (error) {
      alert('Pokémon não encontrado!');
      console.error(error);
    }
  }
  