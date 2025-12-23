import { createSlice } from '@reduxjs/toolkit';

const getInitialSkins = () => {
    const saved = localStorage.getItem('cs2SkinsMarketplace');
    if (!saved) return [];
    try {
        return JSON.parse(saved).map(skin => ({
            ...skin,
            bids: Array.isArray(skin.bids) ? skin.bids : []
        }));
    } catch (e) { return []; }
};

const skinsSlice = createSlice({
    name: 'skins',
    initialState: {
        items: getInitialSkins(),
        searchTerm: '',
        selectedWeapon: '',
        editingSkin: null,
        selectedSkin: null,
    },
    reducers: {
        addSkin: (state, action) => {
            const { skinData, user } = action.payload;
            const newSkin = { 
                ...skinData, 
                id: Date.now(), 
                bids: [], 
                ownerId: user?.id, 
                createdAt: new Date().toISOString() 
            };
            state.items.push(newSkin);
            localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(state.items));
        },
        updateSkin: (state, action) => {
            const index = state.items.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
                localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(state.items));
            }
        },
        deleteSkin: (state, action) => {
            state.items = state.items.filter(s => s.id !== action.payload);
            localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(state.items));
        },
        addBid: (state, action) => {
            const { skinId, bidData } = action.payload;
            const index = state.items.findIndex(s => s.id === skinId);
            if (index !== -1) {
                const currentBids = state.items[index].bids ? [...state.items[index].bids] : [];
                currentBids.push({ ...bidData, id: Date.now(), timestamp: new Date().toISOString() });
                state.items[index].bids = currentBids;
                localStorage.setItem('cs2SkinsMarketplace', JSON.stringify(state.items));
            }
        },
        setSearchTerm: (state, action) => { state.searchTerm = action.payload; },
        setSelectedWeapon: (state, action) => { state.selectedWeapon = action.payload; },
        setEditingSkin: (state, action) => { state.editingSkin = action.payload; },
        clearEditingSkin: (state) => { state.editingSkin = null; },
        setSelectedSkin: (state, action) => { state.selectedSkin = action.payload; },
        clearSelectedSkin: (state) => { state.selectedSkin = null; },
    }
});

export const { 
    addSkin, updateSkin, deleteSkin, addBid, 
    setSearchTerm, setSelectedWeapon, setEditingSkin, 
    clearEditingSkin, setSelectedSkin, clearSelectedSkin 
} = skinsSlice.actions;

export default skinsSlice.reducer;

export const selectFilteredSkinsByWeaponType = (state, weaponType) => {
  const allSkins = state.skins?.items || [];
  const categories = {
    knives: ['karambit', 'butterfly knife', 'm9 bayonet', 'bayonet', 'ursus knife', 'skeleton knife', 'talon knife', 'gut knife', 'falchion knife', 'navaja knife', 'stiletto knife', 'classic knife', 'paracord knife', 'survival knife', 'nomad knife', 'kukri knife', 'flip knife', 'bowie knife', 'huntsman knife'],
    pistols: ['glock-18', 'usp-s', 'desert eagle', 'p250', 'dual berettas', 'five-seven', 'tec-9', 'cz75-auto', 'r8 revolver', 'p2000'],
    rifles: ['ak-47', 'm4a4', 'm4a1-s', 'awp', 'galil ar', 'famas', 'aug', 'sg 553', 'ssg 08', 'scar-20', 'g3sg1'],
    smgs: ['mac-10', 'mp9', 'mp7', 'mp5-sd', 'ump-45', 'p90', 'pp-bizon'],
    heavy: ['nova', 'xm1014', 'sawed-off', 'mag-7', 'm249', 'negev']
  };
  
  const allowed = categories[weaponType] || [];
  
  return allSkins.filter(skin => {
    if (!skin || !skin.weapon) return false;
    // Приводим название оружия к нижнему регистру перед поиском
    const weaponName = String(skin.weapon).toLowerCase().trim();
    return allowed.some(a => a.toLowerCase() === weaponName);
  });
};