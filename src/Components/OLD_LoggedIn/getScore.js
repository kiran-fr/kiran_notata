const getInputType = ({dd, k, key, prefix}) => {
  let f = dd.find(d => d.title === k[0].toUpperCase()+k.slice(1));
  let q = (f.questions.find(q => `${prefix}_${q.field}` === key));
  return q.type;
}

export default ({d, dd, settings, prefix}) => {
  
  let allowedKeys = dd.map(_d => _d.title.toLowerCase());

  let _settings = {};
  for (let key in settings) {
    let [ k ] = key.split('_');
    if (k === prefix) _settings[key] = settings[key]
  }
  
  let totalScore = 0;
  let scoreSystem = {}

  for (let key in d) {
    let [ k ] = key.split('_');
    let val = d[key];
    let sKey = `${prefix}_${key}`
    let s = _settings[sKey];
    if (s && typeof s !== 'string')  {
      if (typeof val === 'string') { val = [val] }
      (val || []).forEach(v => {
        let h = s.find(_s => _s.key === v)
        if (h) {
          scoreSystem[k] = scoreSystem[k] || {val: 0, potential: 0, potentialNegative: 0};
          totalScore += h.val;
          scoreSystem[k].val += h.val;
        }
      })
    }
  }

  for (let key in _settings) {
    let [ , k ] = key.split('_');
    let p = 0;
    let neg = 0;
    if (_settings[key] && allowedKeys.some(_k => _k === k)) {
      let inputType = getInputType({dd, k, key, prefix});

      let kk = key.split('_')
      kk.shift();
      kk = kk.join('_');

      if (inputType !== 'radio') {
        _settings[key].forEach(n => {
          if (d[kk]) {
            if (n.val === 1) p += 1;
            if (n.val === -1) neg -= 1;
          }
        })
      }
      if (inputType === 'radio') {
        let _neg = 0;
        let _pos = 0;
        _settings[key].forEach(n => {
          if (d[kk]) {
            if (n.val === 1) _pos = 1
            if (n.val === -1) _neg = -1;
          }
        })
        p+=_pos;
        neg+=_neg;
      }
      scoreSystem[k] = scoreSystem[k] || {val: 0, potential: 0, potentialNegative: 0};
      scoreSystem[k].potential += p;
      scoreSystem[k].potentialNegative += neg;
    }
  }

  for (let key in scoreSystem) {
    let { val, potential, potentialNegative } = scoreSystem[key];
    let range = potential - potentialNegative;
    let pos = val - potentialNegative;
    let score = Math.round(pos/range * 100) / 10;
    scoreSystem[key].score = score
  }


  return scoreSystem;
}


