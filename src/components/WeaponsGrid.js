import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { selectTheme } from '../store/slices/uiSlice';
import { setSelectedSkin, setSearchTerm } from '../store/slices/skinsSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const WEAPON_IMAGES = {
    knives: {
        "Karambit": "https://images.steamusercontent.com/ugc/1678114490695085562/8B491B581A4B9C7B5298071425F2B29A39A2A12F/",
        "Butterfly Knife": "https://images.steamusercontent.com/ugc/1678114490695103693/794147E84A4E9426202D45145910CBB007797CE5/",
        "M9 Bayonet": "https://images.steamusercontent.com/ugc/1678114490695100121/1A55109E0C88792E5D56EA04DC1F676E44F9DEC2/",
        "Bayonet": "https://images.steamusercontent.com/ugc/1678114490695069593/515DE291204D6D896724D9FBB6856FCC6054A787/",
        "Talon Knife": "https://images.steamusercontent.com/ugc/1678114490695111434/A0842AD04CDA9292483B8896D1DCDAFFAC9C2E5E/",
        "Ursus Knife": "https://images.steamusercontent.com/ugc/1678114490695113023/34ECDA985C12503DF5B88E9BDA1826F61CC9E80A/",
        "Skeleton Knife": "https://images.steamusercontent.com/ugc/1678114490695118767/1FC401A844008BCAA89F8381CBE7B550A051609D/",
        "Stiletto Knife": "https://images.steamusercontent.com/ugc/1678114490695110051/1AEFE4CA0E433FC8C3F924BA362283E0666B5F8D/",
        "Gut Knife": "https://images.steamusercontent.com/ugc/1678114490695082981/1D53007384970E8EAF28448312777683FD633A79/",
        "Shadow Daggers": "https://images.steamusercontent.com/ugc/1678114490695106940/13F409F23E653107C90711E5AB258B52B187FF6A/",
        "Bowie Knife": "https://images.steamusercontent.com/ugc/1678114490695107937/01ADDB54D400815308B1D312290594A3177DD55F/",
        "Navaja Knife": "https://images.steamusercontent.com/ugc/1678114490695109000/1A7E57791FA9383CCE67D5915FFC442C7DE2694A/",
        "Paracord Knife": "https://images.steamusercontent.com/ugc/1678114490695115740/073B5FA991A256EC2264B1C1C581401631EB51CB/",
        "Huntsman Knife": "https://images.steamusercontent.com/ugc/1678114490695102237/7621BBAD70410DEB629D60ED98EF248DAC525356/",
        "Falchion Knife": "https://images.steamusercontent.com/ugc/1678114490695105785/ADCC43A018FD4FE315DBDBC7960CFC52C5D63E3E/",
        "Survival Knife": "https://images.steamusercontent.com/ugc/1678114490695117275/AE03AED81864DC2EE1E1118BB973418F910098AC/",
        "Nomad Knife": "https://images.steamusercontent.com/ugc/1678114490695119861/FDB3CE5CEEF1584781759EF5A7BD6F819BF12E9B/",
        "Flip Knife": "https://images.steamusercontent.com/ugc/1678114490695072959/EBFC00735792B1E2947B30A321A07215DAE8CEED/",
        "Kukri Knife": "https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XuWbwcuyMESA4Fdl-4nnpU7iQA3-kKnr8ytd6s2lfa9_Kb6VXmPGwuogsbNvSyi3zR4jsTnQztyqdS6QP1IoXpoiEeAC5Be5l9CxKaq8sIvgdE5J/330x192?allow_animated=1",
        "Classic Knife": "https://community.fastly.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XuWbwcuyMESA4Fdl-4nnpU7iQA3-kKnr8ytd6s2te7cjd6HHXmHBxep157VtTi_rzUR-5WiHnt39c3_EZg4pW5UjQOZbsBCxw8qnab32FBG7RA/330x192?allow_animated=1"
    },
    pistols: {
        "USP-S": "https://images.steamusercontent.com/ugc/1678114436958547071/608E10862885084BB1CEC55D87BA5E694BFD621D/",
        "Glock-18": "https://images.steamusercontent.com/ugc/1678114436958584827/8430AFEA5349054D0923CEFA7D2E7BF3950CE3D7/",
        "Desert Eagle": "https://images.steamusercontent.com/ugc/1678114490694383324/29E8F0D7D0BE5E737D4F663EE8B394B5C9E00BDD/",
        "P250": "https://images.steamusercontent.com/ugc/1678114436958721360/0BC9109121FB318A3BB18F6FA92692C7AA433205/",
        "Five-SeveN": "https://images.steamusercontent.com/ugc/1678114490694340449/7C33B4A78AE94A3D14E7CD0F71B295CF61717D75/",
        "CZ75-Auto": "https://images.steamusercontent.com/ugc/1678114490694369752/057939990F5F295FC5EAF8F758CDEF21A7CFEB8A/",
        "P2000": "https://images.steamusercontent.com/ugc/1678114436958368006/C2221F8C2EF3DF6C2FCDAFD1BEA9FAAE01F64054/",
        "Tec-9": "https://images.steamusercontent.com/ugc/1678114490694357218/74538566492B4AF122BE9B996BDD7D08585DB3C0/",
        "R8 Revolver": "https://images.steamusercontent.com/ugc/1678114490694393914/A7C0AB2973CDC0BDB53EBBEF960ECBAE8842F719/",
        "Dual Berettas": "https://images.steamusercontent.com/ugc/1678114436958660023/6563E9D274C6E799D71A7809021624F213D5E080/"
    },
    rifles: {
        "FAMAS": "https://images.steamusercontent.com/ugc/1678114490694959886/C897878873BEB9E9CA4C68EF3A666869C6E78031/",
        "Galil AR": "https://images.steamusercontent.com/ugc/1678114490694970533/B84153658AFDB7DC26A9854E566FDE3FC42C22EF/",
        "M4A1-S": "https://images.steamusercontent.com/ugc/1678114490694982272/A8D2A028FA33EB117D6D7665303C3316169C33F7/",
        "AK-47": "https://images.steamusercontent.com/ugc/1678114490694988506/A320F13FEA4F21D1EB3B46678D6B12E97CBD1052/",
        "M4A4": "https://images.steamusercontent.com/ugc/1678114490694997174/39B3BD8D556E5CDEBB79D60902442986EB9AEDFF/",
        "AUG": "https://images.steamusercontent.com/ugc/1678114490695004117/6B97A75AA4C0DBB61D81EFB6D5497B079B67D0DA/",
        "SG 553": "https://images.steamusercontent.com/ugc/1678114490695010811/74040869391EA2AB25777F3670A6015191A73E6C/",
        "SSG 08": "https://images.steamusercontent.com/ugc/1678114490695024026/271A856F50FD6AC1014334098B1A43D61BDDB892/",
        "AWP": "https://images.steamusercontent.com/ugc/1678114490695030741/2899E1C6345ED05D62BDBE112DB1B117D022E477/",
        "SCAR-20": "https://images.steamusercontent.com/ugc/1678114490695036819/1552C7B64DFE9E542A3B730EDB80E21DCC6D243D/",
        "G3SG1": "https://images.steamusercontent.com/ugc/1678114490695044261/986D0E07F58C81C99AA5A47D86340F4C3D400339/"
    },
    smgs: {
        "MAC-10": "https://images.steamusercontent.com/ugc/1678114490694589428/41E40474AA21A9ED90D9B21DD5ADF0910F766426/",
        "MP9": "https://images.steamusercontent.com/ugc/1678114490694595926/C9103EFDE0845EB715CDCB67BF74BAD646B1C5BC/",
        "MP7": "https://images.steamusercontent.com/ugc/1678114490694604317/0AFC09868C38A00FDE50C3E4943637C714E8981E/",
        "MP5-SD": "https://images.steamusercontent.com/ugc/1678114490694612839/2E92234C951819F3AE44742E96C488EF97F26C7C/",
        "UMP-45": "https://images.steamusercontent.com/ugc/1678114490694619233/55669E2321F28EFED775BE27F7E3C7E71B501520/",
        "P90": "https://images.steamusercontent.com/ugc/1678114490694625410/15FEDD7FC90F003B8DE0DED36245B438D54BC3D2/",
        "PP-Bizon": "https://images.steamusercontent.com/ugc/1678114490694631825/58523D37EE43B9A4EF42A67B65A28E5967743A56/"
    },
    heavy: {
        "Nova": "https://images.steamusercontent.com/ugc/1678114490694493933/D9063351D4233101D02DEF18AA7E901D02F9B4C1/",
        "XM1014": "https://images.steamusercontent.com/ugc/1678114490694508505/7BD7F3985D680DB2FCB7CAD32B07C90B758C234B/",
        "Sawed-Off": "https://images.steamusercontent.com/ugc/1678114490694523085/4C4DF9C84E1EDC20488C45061AD88CFD2460C4A5/",
        "MAG-7": "https://images.steamusercontent.com/ugc/1678114490694516125/5480BA05C61153309163C46E7D646D6958AF9BF7/",
        "M249": "https://images.steamusercontent.com/ugc/1678114490694558792/02D1CF8FA8C41AF5A43749BF780C4C4A2E50EA8E/",
        "Negev": "https://images.steamusercontent.com/ugc/1678114490694574856/1CF512EB01BD62BCAE5C54FEEC694F418AB71D30/"
    },
};

const WeaponsGrid = ({ skins = [], type = 'knives' }) => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const theme = useAppSelector(selectTheme);
    const dispatch = useAppDispatch();
    const isDark = theme === 'dark';

    const safeStr = (val) => val ? String(val).trim() : "";

    const styles = {
        container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
        grid: { 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1.5rem' 
        },
        weaponCard: {
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            borderRadius: '16px', 
            padding: '1.5rem',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)',
            border: isDark ? '1px solid #1a0505' : '1px solid rgba(0,0,0,0.05)',
            cursor: 'pointer', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            transition: '0.3s'
        },
        imageContainer: { width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
        weaponImage: { maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' },
        weaponName: { fontSize: '1.2rem', fontWeight: 'bold', color: isDark ? '#fff' : '#333', marginBottom: '10px' },
        badge: { backgroundColor: '#b01b2e', color: '#fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem' }
    };

    const handleWeaponClick = (weaponNameStr) => {
        // 1. Ставим фильтр по названию оружия (например "AK-47")
        dispatch(setSearchTerm(weaponNameStr));
        
        // 2. Ищем первый подходящий скин, чтобы открыть модалку (глазик)
        const firstFoundSkin = skins.find(s => safeStr(s?.weapon).toLowerCase() === weaponNameStr.toLowerCase());
        
        if (firstFoundSkin) {
            dispatch(setSelectedSkin(firstFoundSkin));
        }

        // 3. ПЕРЕНАПРАВЛЕНИЕ: переходим на главную ТОЛЬКО если мы не на странице категорий
        // Если мы уже в "rifles" или "knives", navigate('/') НЕ НУЖЕН
        if (location.pathname === '/' || location.pathname === '/profile') {
            navigate('/');
        }
    };

    const currentList = WEAPON_IMAGES[type] ? Object.keys(WEAPON_IMAGES[type]) : [];

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {currentList.map((weaponName) => {
                    const imageUrl = WEAPON_IMAGES[type][weaponName];
                    const count = skins.filter(s => safeStr(s?.weapon).toLowerCase() === weaponName.toLowerCase()).length;

                    return (
                        <div 
                            key={weaponName} 
                            style={styles.weaponCard}
                            onClick={() => handleWeaponClick(weaponName)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={styles.imageContainer}>
                                <img src={imageUrl} alt={weaponName} style={styles.weaponImage} />
                            </div>
                            <h3 style={styles.weaponName}>{weaponName}</h3>
                            <div style={styles.badge}>
                                {count} предложений
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WeaponsGrid;