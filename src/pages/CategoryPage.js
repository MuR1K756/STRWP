import React from 'react';
import { useAppSelector } from '../hooks/redux';
import { selectFilteredSkinsByWeaponType } from '../store/slices/skinsSlice';
import WeaponsGrid from '../components/WeaponsGrid';
import { Container, Typography } from '@mui/material';

const CategoryPage = ({ type, title, icon }) => {
  const categorySkins = useAppSelector(state => selectFilteredSkinsByWeaponType(state, type));

  const weaponCategories = {
    knives: ['Karambit', 'Bayonet', 'M9 Bayonet', 'Butterfly Knife', 'Shadow Daggers', 'Gut Knife', 'Falchion Knife', 'Navaja Knife', 'Stiletto Knife', 'Talon Knife', 'Ursus Knife', 'Classic Knife', 'Paracord Knife', 'Survival Knife', 'Nomad Knife', 'Skeleton Knife', 'Kukri Knife','Flip Knife','Bowie Knife','Huntsman Knife'],
    pistols: ['USP-S', 'Glock-18', 'P2000', 'P250', 'Five-SeveN', 'Tec-9', 'CZ75-Auto', 'Dual Berettas', 'Desert Eagle', 'R8 Revolver'],
    rifles: ['AK-47', 'M4A4', 'M4A1-S', 'AUG', 'SG 553', 'Galil AR', 'FAMAS', 'AWP', 'SSG 08', 'SCAR-20', 'G3SG1'],
    smgs: ['MAC-10', 'MP9', 'MP7', 'MP5-SD', 'UMP-45', 'P90', 'PP-Bizon'],
    heavy: ['Nova', 'XM1014', 'Sawed-Off', 'MAG-7', 'M249', 'Negev']
  };

  const weaponsInThisCategory = weaponCategories[type] || [];

  // СОЗДАЕМ КАРТУ КАРТИНКИ
  const weaponImagesMap = {};
  categorySkins.forEach(skin => {
    // Берем только если ссылка длинная (похожа на реальный URL)
    if (skin.weapon && skin.imageUrl && skin.imageUrl.length > 10) {
      weaponImagesMap[skin.weapon] = skin.imageUrl;
    }
  });

  // Теперь мы НЕ берем imageUrl из скинов для этой страницы.
  // Мы передаем в WeaponsGrid только названия, чтобы он брал системные фото.
  const weaponsWithData = weaponsInThisCategory.map(weaponName => ({
    name: weaponName,
    // imageUrl удаляем отсюда, чтобы WeaponsGrid использовал WEAPON_IMAGES
  }));

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        {icon} {title}
      </Typography>

      <WeaponsGrid 
        weapons={weaponsWithData} 
        category={type} 
        skins={categorySkins}
        mode="visual" 
      />
    </Container>
  );
};

export default CategoryPage;