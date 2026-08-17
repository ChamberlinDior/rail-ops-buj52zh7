(function(){
  'use strict';
  const replacements={
    'Mireille Ondo':'Mireille Agondjo','Jean-Norbert Essono':'Jean-Norbert Lekogo','J-N. Essono':'J-N. Lekogo',
    'Grace Mba':'Grâce Mavoungou','Patrick Nguema':'Patrick Okoumba','Nadia Obame':'Nadia Raponda',
    'Louis Meye':'Louis Nziengui','Alice Ndong':'Alice Andjoua','Marc Ella':'Marc Rombi',
    'Paul Biyoghe':'Paul Mounguengui','P. Biyoghe':'P. Mounguengui','Aline Nze':'Aline Lekabi','A. Nze':'A. Lekabi',
    'Jean-Pierre Obame':'Jean-Pierre Raponda','Christian Mba':'Christian Mabika','Sarah Ondo':'Sarah Agondjo',
    'Paul Nguema':'Paul Okoumba','Diane Essono':'Diane Moukagni','Rose Obame':'Rose Raponda',
    'Famille Obame':'Famille Raponda','Alice Nze':'Alice Lekabi','Patrick Mba':'Patrick Mabika',
    'Éric Nguema':'Éric Okoumba','Clovis Ondo':'Clovis Agondjo','Serge Ella':'Serge Rombi',
    'Alain Meye':'Alain Nziengui','David Essono':'David Lekogo','m.ondo@setrag.ga':'m.agondjo@setrag.ga',
    'grace.mba@setrag.ga':'grace.mavoungou@setrag.ga','p.nguema@setrag.ga':'p.okoumba@setrag.ga'
  };
  const migrate=value=>{let next=value;Object.entries(replacements).forEach(([from,to])=>next=next.split(from).join(to));return next};
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i),value=localStorage.getItem(key);
      if(value){const next=migrate(value);if(next!==value)localStorage.setItem(key,next)}
    }
    localStorage.setItem('setrag-name-diversity-version','2026-08-17');
  }catch(error){console.warn('Migration des noms non persistée',error)}
})();
