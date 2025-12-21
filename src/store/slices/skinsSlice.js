import { createSlice } from '@reduxjs/toolkit';

class SkinAPI {
  constructor() {
    this.skins = JSON.parse(localStorage.getItem('cs2SkinsMarketplace')) || [
      {
        id: 1,
        name: "AK-47 | Красная линия",
        weapon: "AK-47",
        quality: "Прямо с завода",
        float: 0.15,
        price: 8500,
        imageUrl: "https://steamchttps://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPv9NLPF2G1UsZFw373Cp96kigbgrUBuY22nLIWUcgRvN17Y8lnrlbrm157quJ3XiSw0p7BLliMommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdD1965O0q4yZqPv9NLPF2G5U18l4j_vM8oWg0Qew_BJvYzv7J4WUJw45ZFzV_1G_xr-7g8C76Z_JziU1uHIl4X2OylXp1u9POTI/360fx360f",
        sticker: "4x Starladder 2019",
        statTrak: false,
        description: "Легендарный AK-47 с уникальным красным дизайном",
        bids: [],
        ownerId: 1, // Добавляем владельца
        createdAt: new Date().toISOString() // ← ЗАПЯТАЯ БЫЛА ПРОПУЩЕНА
      },
      {
        id: 2,
        name: "AWP | История о драконе",
        weapon: "AWP",
        quality: "Немного поношенное",
        float: 0.25,
        price: 12500,
        imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdD1965O0q4yZqPv9NLPF2G5U18l4j_vM8oWg0Qew_BJvYzv7J4WUJw45ZFzV_1G_xr-7g8C76Z_JziU1uHIl4X2OylXp1u9POTI/360fx360f",
        sticker: "1x Crown Foil",
        statTrak: true,
        description: "Самая желанная AWP в игре с драконом",
        bids: [],
        ownerId: 2, // Добавляем владельца
        createdAt: new Date().toISOString()
      }
    ];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(this.skins));
  }

  all() {
    return JSON.parse(JSON.stringify(this.skins));
  }

  add(skin) {
    const newSkin = {
      ...skin,
      id: Date.now(),
      price: parseInt(skin.price) || 0,
      float: parseFloat(skin.float) || 0,
      bids: [],
      ownerId: skin.ownerId || null, // Сохраняем владельца
      createdAt: new Date().toISOString()
    };
    this.skins.push(newSkin);
    this.saveToStorage();
    return { ...newSkin };
  }

  update(skin) {
    const index = this.skins.findIndex(s => s.id === skin.id);
    if (index !== -1) {
      this.skins[index] = {
        ...this.skins[index],
        ...skin,
        price: parseInt(skin.price) || 0,
        float: parseFloat(skin.float) || 0
      };
      this.saveToStorage();
      return { ...this.skins[index] };
    }
    return null;
  }

  delete(id) {
    const initialLength = this.skins.length;
    this.skins = this.skins.filter(skin => skin.id !== id);
    this.saveToStorage();
    return this.skins.length !== initialLength;
  }

  find(id) {
    const skin = this.skins.find(skin => skin.id === id);
    return skin ? { ...skin } : null;
  }

  addBid(skinId, userId, userName, amount) {
    const index = this.skins.findIndex(s => s.id === skinId);
    if (index !== -1) {
      const newBid = {
        id: Date.now(),
        userId,
        userName,
        amount,
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      
      const updatedSkin = {
        ...this.skins[index],
        bids: [...(this.skins[index].bids || []), newBid]
      };
      
      this.skins[index] = updatedSkin;
      this.saveToStorage();
      return { ...newBid };
    }
    return null;
  }

  cancelBid(skinId, bidId, userId) {
    const index = this.skins.findIndex(s => s.id === skinId);
    if (index !== -1 && this.skins[index].bids) {
      const bidIndex = this.skins[index].bids.findIndex(b => b.id === bidId && b.userId === userId);
      if (bidIndex !== -1 && this.skins[index].bids[bidIndex].status === 'active') {
        const refundAmount = this.skins[index].bids[bidIndex].amount;
        
        const updatedBids = [...this.skins[index].bids];
        updatedBids[bidIndex] = {
          ...updatedBids[bidIndex],
          status: 'cancelled'
        };
        
        this.skins[index] = {
          ...this.skins[index],
          bids: updatedBids
        };
        
        this.saveToStorage();
        return refundAmount;
      }
    }
    return 0;
  }
}

const skinAPI = new SkinAPI();

const skinsSlice = createSlice({
  name: 'skins',
  initialState: {
    items: skinAPI.all(),
    loading: false,
    error: null,
    searchTerm: '',
    selectedWeapon: '',
    editingSkin: null,
    selectedSkin: null,
  },
  reducers: {
    setSkins: (state, action) => {
      state.items = action.payload;
    },
    addSkin: (state, action) => {
      const newSkin = skinAPI.add(action.payload);
      if (newSkin) {
        state.items = skinAPI.all();
      }
    },
    updateSkin: (state, action) => {
      const updatedSkin = skinAPI.update(action.payload);
      if (updatedSkin) {
        state.items = skinAPI.all();
      }
    },
    deleteSkin: (state, action) => {
      if (skinAPI.delete(action.payload)) {
        state.items = skinAPI.all();
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedWeapon: (state, action) => {
      state.selectedWeapon = action.payload;
    },
    setEditingSkin: (state, action) => {
      state.editingSkin = action.payload;
    },
    clearEditingSkin: (state) => {
      state.editingSkin = null;
    },
    setSelectedSkin: (state, action) => {
      state.selectedSkin = action.payload;
    },
    clearSelectedSkin: (state) => {
      state.selectedSkin = null;
    },
    addBid: (state, action) => {
      const { skinId, userId, userName, amount } = action.payload;
      skinAPI.addBid(skinId, userId, userName, amount);
      state.items = skinAPI.all();
    },
    cancelBid: (state, action) => {
      const { skinId, bidId, userId } = action.payload;
      const refundAmount = skinAPI.cancelBid(skinId, bidId, userId);
      state.items = skinAPI.all();
      return refundAmount;
    },
  },
});

export const {
  setSkins,
  addSkin,
  updateSkin,
  deleteSkin,
  setSearchTerm,
  setSelectedWeapon,
  setEditingSkin,
  clearEditingSkin,
  setSelectedSkin,
  clearSelectedSkin,
  addBid,
  cancelBid,
} = skinsSlice.actions;

export default skinsSlice.reducer;

export const selectAllSkins = (state) => state.skins.items;
export const selectSearchTerm = (state) => state.skins.searchTerm;
export const selectSelectedWeapon = (state) => state.skins.selectedWeapon;
export const selectEditingSkin = (state) => state.skins.editingSkin;
export const selectSelectedSkin = (state) => state.skins.selectedSkin;

export const selectFilteredSkins = (state) => {
  const { items, searchTerm, selectedWeapon } = state.skins;
  return items.filter(skin => {
    const matchesSearch = skin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skin.weapon.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWeapon = !selectedWeapon || skin.weapon === selectedWeapon;
    return matchesSearch && matchesWeapon;
  });
};

export const selectWeapons = (state) => {
  return [...new Set(state.skins.items.map(skin => skin.weapon))];
};

// Добавьте этот селектор в ваш skinsSlice
export const selectFilteredSkinsByWeaponType = (state, weaponType) => {
  const allSkins = selectFilteredSkins(state);
  
  const weaponCategories = {
    knives: [
      'Karambit', 'Bayonet', 'M9 Bayonet', 'Butterfly Knife', 
      'Shadow Daggers', 'Gut Knife', 'Falchion Knife', 'Navaja Knife',
      'Stiletto Knife', 'Talon Knife', 'Ursus Knife', 'Classic Knife',
      'Paracord Knife', 'Survival Knife', 'Nomad Knife', 'Skeleton Knife'
    ],
    pistols: [
      'USP-S', 'Glock-18', 'P2000', 'P250', 'Five-SeveN',
      'Tec-9', 'CZ75-Auto', 'Dual Berettas', 'Desert Eagle', 'R8 Revolver'
    ],
    rifles: [
      'AK-47', 'M4A4', 'M4A1-S', 'AUG', 'SG 553',
      'Galil AR', 'FAMAS', 'AWP', 'SSG 08', 'SCAR-20', 'G3SG1'
    ],
    smgs: [
      'MAC-10', 'MP9', 'MP7', 'MP5-SD', 'UMP-45',
      'P90', 'PP-Bizon'
    ],
    heavy: [
      'Nova', 'XM1014', 'Sawed-Off', 'MAG-7',
      'M249', 'Negev'
    ]
  };

  const weaponsInCategory = weaponCategories[weaponType] || [];
  return allSkins.filter(skin => 
    weaponsInCategory.includes(skin.weapon)
  );
};