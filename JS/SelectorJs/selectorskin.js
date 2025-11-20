const skill_btn = $('#skills-btn');
const char_btn = $('#characters-btn');
const charInfo = $('.character-information');
const charSelect = $('.character-selector');
const charSkills = $('.character-skills');
const charList = $('.wrapper-conteiner');
const characterImg = $('.Operator-Image');
const backgroundImage = $('.BG-Operator-Image');
const exitList_btn = $('.exit-button p');
const exitSkill_btn = $('.skill-exit-button');
const nameEl = $('.Operator-title');

// Partes reusáveis
const isCharListActive = () => charList.classList.contains('active');
const isCharInfoActive = () => charInfo.classList.contains('active');

const getResponsiveValue = (data, key) => isPortrait() ? data.mobileValue[key] : data.desktopValue[key];

function applyOperatorTransform(isMoved) {
  if (!currentOperatorId || !characterImg) return;
  const operator = window.operatorsData.find(op => op.id === currentOperatorId);
  if (!operator) return;

  const transformVal = isMoved
    ? getResponsiveValue(operator, 'movedForm')
    : getResponsiveValue(operator, 'transform');

  characterImg.style.transition = 'transform 0.5s ease';
  void characterImg.offsetWidth; // força reflow
  characterImg.style.transform = cleanString(transformVal);
}

// ✅ Aplica o transform correto automaticamente com base no estado atual
function updateOperatorTransformByState() {
  const shouldMove = isCharInfoActive() && !isPortrait();

  // se estiver em portrait, nunca aplica movedForm
  applyOperatorTransform(shouldMove);
  characterImg.classList.toggle('moved', shouldMove);
}

function updateResizeClass() {
  const charImgMoved = () => characterImg.classList.add('moved');
  const charImgNotMoved = () => characterImg.classList.remove('moved');

  if (isPortrait()) { charImgNotMoved(); }
  else if (isCharListActive()) { charImgMoved(); }
  else { charImgNotMoved(); }
}

function updateCharSelectVisibility() {
  const selectDeactivate = () => charSelect.classList.add('deactivate');
  const selectActivate = () => charSelect.classList.remove('deactivate');

  if (isCharListActive()) { selectDeactivate(); } 

  else if (isCharInfoActive() && isPortrait()) { selectDeactivate(); } 

  else { selectActivate(); }
}

window.addEventListener('resize', () => {
  updateResizeClass();
  updateCharSelectVisibility();
  updateOperatorTransformByState(); // ✅ reaplica transform conforme o estado
});

window.addEventListener('orientationchange', () => {
  updateResizeClass();
  updateCharSelectVisibility();
  updateOperatorTransformByState(); // ✅ reaplica transform conforme o estado
});

skill_btn.addEventListener('click', function () {
  charInfo.classList.toggle('active');
  backgroundImage.classList.toggle('skills-open');
  updateResizeClass();
  updateCharSelectVisibility();
  updateOperatorTransformByState(); // ✅ aplica o transform correto
});

char_btn.addEventListener('click', function () {
  charList.classList.toggle('active');
  backgroundImage.classList.remove('skills-open');

  if (isCharListActive()) { charInfo.classList.remove('active'); } 
  
  else { charInfo.classList.add('active'); }

  updateCharSelectVisibility();
  updateOperatorTransformByState();
});

exitList_btn.addEventListener('click', () => {
  charList.classList.remove('active');
  updateCharSelectVisibility();

  if (charList.classList.contains('active')) {
    updateOperatorTransformByState();
  }
});

exitSkill_btn.addEventListener('click', () => {
  charInfo.classList.remove('active');
  backgroundImage.classList.remove('skills-open');
  updateCharSelectVisibility();
  updateOperatorTransformByState(); // ✅ aplica transform normal
});

// ------------------------------------------------------
// 🖱️ Scroll e drag vertical em .character-skills
// ------------------------------------------------------

let verticalIsDragging = false;
let startY;
let initialScrollTop;

const MASK_STYLES = {
  none: 'none',
  fadeBottom: 'linear-gradient(to bottom, black 85%, transparent)',
  fadeTop: 'linear-gradient(to top, black 85%, transparent)',
  fadeBoth: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)'
};

const setMaskImage = (style) => {
  charSkills.style.maskImage = style;
  charSkills.style.webkitMaskImage = style;
};

function updateMaskImage() {
  const { scrollTop, scrollHeight, clientHeight } = charSkills;
  const atTop = scrollTop <= 0;
  const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

  if (atTop && atBottom) setMaskImage(MASK_STYLES.none);
  else if (atTop) setMaskImage(MASK_STYLES.fadeBottom);
  else if (atBottom) setMaskImage(MASK_STYLES.fadeTop);
  else setMaskImage(MASK_STYLES.fadeBoth);
}

function startVerticalDrag(y) {
  verticalIsDragging = true;
  startY = y - charSkills.offsetTop;
  initialScrollTop = charSkills.scrollTop;
}

function dragVerticalTo(y) {
  if (!verticalIsDragging) return;
  const offset = y - charSkills.offsetTop;
  const walk = (offset - startY);
  charSkills.scrollTop = initialScrollTop - walk;
  updateMaskImage();
}

function endVerticalDrag() { verticalIsDragging = false; }

charSkills.addEventListener('mousedown', (e) => {
  startVerticalDrag(e.pageY);
  charSkills.style.cursor = 'grabbing';
  e.preventDefault();
});

document.addEventListener('mouseup', () => { endVerticalDrag(); charSkills.style.cursor = 'grab'; });
document.addEventListener('mousemove', (e) => { dragVerticalTo(e.pageY); });
charSkills.addEventListener('touchstart', (e) => { startVerticalDrag(e.touches[0].pageY); });
document.addEventListener('touchend', endVerticalDrag);
document.addEventListener('touchmove', (e) => { dragVerticalTo(e.touches[0].pageY); });

charSkills.style.cursor = 'grab';
charSkills.style.overflowY = 'scroll';
charSkills.addEventListener('scroll', updateMaskImage);
window.addEventListener('load', updateMaskImage);

// ✅ Atualiza transform do operador na carga inicial
window.addEventListener('load', updateOperatorTransformByState);

//Seletor de Personagens Abaixo

// Seleção de variáveis para updateSkills
const skillsContainer = $('.character-skills');
    const classImg = $('.operator-class-img');
    const branchImg = $('.operator-branch-img');
    const classText = $('.operator-class');
    const branchText = $('.operator-branch');

// Função para criar o conteúdo HTML do operador
function createOperatorCard(operator) {
  const container = document.createElement('div');
  container.className = 'operator-conteiner';
  container.dataset.id = operator.id;

  const { widthInBox, transformInBox } = operator.inBoxConfigs;

  container.innerHTML = `
    <div class="card">
      <svg class="card__overlay" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">
        <use href="#cardRect"></use>
      </svg>
    </div>
    <div class="operator-selector-image"> 
      <img src="${operator.characterImage}" id="${operator.id}" style="width: ${widthInBox}; transform: ${transformInBox};" /> 
    </div>
    <p class="operator-selector-name" id="codename_${operator.id}">${operator.name}</p>
  `;
  
  return container;
}

// Criação dos operadores no outer-container
const outerContainer = $('.outer-block');
outerContainer.innerHTML = ''; // Limpa o container antes de adicionar novos operadores

window.operatorsData.forEach(op => {
  const operatorCard = createOperatorCard(op);
  outerContainer.appendChild(operatorCard);
});

const isPortrait = () => { return window.matchMedia("(orientation: portrait)").matches; }

// === Seleciona todos os operadores após criar ===
const charContainers = Array.from($$('.operator-conteiner'));

// Variáveis de controle
let currentIndex = 0;
let animating = isResizing = false;
let currentOperatorId = null; // operador atualmente selecionado (só setado ao clicar)
let currentOperator = null; // Variável global para armazenar o operador atual

// Função para limpar a string (se necessário)
function cleanString(str) { return str ? str.trim() : ''; }

function setOperatorClicksEnabled(enabled) {
  charContainers.forEach(item => {
    item.style.pointerEvents = enabled ? 'auto' : 'none';
  });
}

function doImageSwap(operatorId) {
  const operator = window.operatorsData.find(op => op.id === operatorId);
  if (!operator) return;

  if (nameEl) nameEl.textContent = operator.name || '';
  currentOperatorId = operatorId;

  updateResponsiveProperties(operator);
  updateSkills(operatorId);

  const newCharacterSrc = operator.characterImage || '';
  const newBackgroundSrc = operator.backgroundImage || '';

  let imagesToLoad = 0;

  const checkAllLoaded = () => {
    imagesToLoad--;
    if (imagesToLoad <= 0 && typeof fadeInCallback === 'function') fadeInCallback();
  };

  function loadImage(imgElement, src, altText) {
    if (!imgElement || !src) return;
    imagesToLoad++;
    imgElement.onload = imgElement.onerror = checkAllLoaded;
    imgElement.src = src;
    imgElement.alt = altText; // sempre define o alt
  }

  loadImage(characterImg, newCharacterSrc, operator.name || '');
  loadImage(backgroundImage, newBackgroundSrc, ''); // se quiser alt vazio para background

  if (imagesToLoad === 0 && typeof fadeInCallback === 'function') fadeInCallback();
}

const fadeOutConfig = { 
    opacity: 'opacity 1s ease-in', 
    filter: 'filter 0.5s ease', 
    opacityValue: '0', 
    filterValue: 'brightness(0)' 
};

const fadeInConfig  = { 
    opacity: 'opacity 0.8s ease', 
    filter: 'filter 0.5s ease-in', 
    opacityValue: '1', 
    filterValue: 'brightness(0.85)' 
};

  const resetStyle = (el) => {
    el.style.transition = '';
    if (el === characterImg) el.style.filter = '';
    else el.style.opacity = '';
  };

// --- Função de animação refatorada ---
function fadeTransitionOperatorChange(operatorId) {
  setOperatorClicksEnabled(false);

  const fadeElements = [characterImg, backgroundImage, nameEl].filter(Boolean);

  let fadeOutCounter = 0;

  // --- Função utilitária para aplicar transição ---
  function applyTransition(el, config) {
    el.style.transition = el === characterImg ? `${config.opacity}, ${config.filter}` : config.opacity;
    el.style.opacity = config.opacityValue;
    if (el === characterImg) el.style.filter = config.filterValue;
  }

// --- Mapeamento de elementos para propriedades a observar ---
const transitionPropertiesMap = new Map([
  [characterImg, ['opacity', 'filter']],
  [backgroundImage, ['opacity']],
  [nameEl, ['opacity']]
]);

const fadeInElements = () => {
  fadeElements.forEach(el => {
    applyTransition(el, fadeInConfig);

    const handleFadeInEnd = (ev) => {
      const relevantProperties = transitionPropertiesMap.get(el) || [];
      if (relevantProperties.includes(ev.propertyName)) {
        el.removeEventListener('transitionend', handleFadeInEnd);
        resetStyle(el);

        // Habilita cliques somente no último elemento
        if (el === fadeElements[fadeElements.length - 1]) {
          setOperatorClicksEnabled(true);
        }
      }
    };

    el.addEventListener('transitionend', handleFadeInEnd);
  });
};

  // --- Callback para doImageSwap ---
  fadeInCallback = fadeInElements;

  // --- Callback de fade-out ---
  const onFadeOutComplete = () => {
    fadeOutCounter++;
    if (fadeOutCounter >= fadeElements.length) {
      doImageSwap(operatorId); // fade-in será disparado via callback
    }
  };

  // --- Fade-out ---
  fadeElements.forEach(el => {
    applyTransition(el, fadeOutConfig);
    el.addEventListener('transitionend', onFadeOutComplete, { once: true });
  });
}

// Função para atualizar as propriedades responsivas
// Agora APENAS aplica valores se houver um operador clicado (currentOperatorId)
function updateResponsiveProperties() {
  // Só aplica se um operador foi selecionado via clique
  if (!currentOperatorId) return;

  const operator = window.operatorsData.find(op => op.id === currentOperatorId);
  if (!operator) return;

  function getOperatorWidth(operator) {
    if (isPortrait() && operator.mobileValue?.width !== undefined) {
      return operator.mobileValue.width;
    } 
    if (!isPortrait() && operator.desktopValue?.width !== undefined) {
      return operator.desktopValue.width;
    }
      return getResponsiveValue(operator, 'width');
  }

  // Uso:
  let widthVal = getOperatorWidth(operator);

  if (characterImg) {
      Object.assign(characterImg.style, {
        width: widthVal,
        transition: 'transform 0.5s ease',
        transform: ''
      });

    const hasMoved = characterImg.classList.contains('moved');
    const transformVal = hasMoved ? getResponsiveValue(operator, 'movedForm') : getResponsiveValue(operator, 'transform');

    void characterImg.offsetWidth; // reflow para garantir transição suave
    characterImg.style.transform = cleanString(transformVal) || '';
  }

  // BG: também aplica apenas quando houver operador selecionado
  const bgTransform = getResponsiveValue(operator, 'bgTransform');
  const bgWidth = getResponsiveValue(operator, 'bgWidth');

  if (backgroundImage) backgroundImage.style.transform = cleanString(bgTransform);
                       backgroundImage.style.width = bgWidth;
}

// --- Atualiza as propriedades ao mudar a orientação ou redimensionar ---
const handleResponsiveUpdate = () => {
  if (currentOperatorId) updateResponsiveProperties();
};

window.addEventListener('orientationchange', handleResponsiveUpdate);
window.addEventListener('resize', handleResponsiveUpdate);

function updateRoleInfo(rolePart, imgElement, textElement) {
  if (!rolePart) return;

  if (imgElement && rolePart.image) { imgElement.src = rolePart.image; }

  if (textElement && rolePart.name) { textElement.textContent = rolePart.name; }
}

const updateSkills = (operatorId) => {
  if (!skillsContainer) return;

  // Limpa as divs existentes no contêiner (se houver)
  skillsContainer.innerHTML = '';

  const operatorData = window.skillsData.find(skill => skill.id === operatorId);

  // Verifica se o operador foi encontrado
  if (!operatorData) return;

  // Busca todas as chaves de habilidades (ex: skill_1, skill_2, skill_3...)
  const skillKeys = Object.keys(operatorData).filter(key => key.startsWith('skill_'));

  // Cria as novas divs de habilidades dinamicamente
  skillKeys.forEach((skillKey) => {
    const skill = operatorData[skillKey];

    // Cria uma nova div para cada habilidade
    const skillDiv = document.createElement('div'); 
    skillDiv.classList.add('skill');  // Adiciona uma classe para estilizar (se necessário)

    // Preenche a nova div com os detalhes da habilidade
    skillDiv.innerHTML = `
      <figure>
        <img src="${skill.imageSkill}" loading="lazy" />
      </figure>
      <figcaption style="padding-top: 3%;">
        <h3>${skill.titleSkill}</h3>
        <p>${skill.descSkill}</p>
      </figcaption>
    `;

    // Adiciona a nova div no contêiner
    skillsContainer.appendChild(skillDiv);
  });

  // Atualiza os dados do papel (role)
  const role = operatorData?.operatorRole;
  if (role) {
    updateRoleInfo(role.class, classImg, classText);
    updateRoleInfo(role.branch, branchImg, branchText);
  }
};


// === Funções de Exibição e Animação ===

// Funções de navegação
function getVisibleCount() {
  const width = window.innerWidth;
  if (width >= 1200) return 4; if (width >= 900) return 3; if (width >= 600) return 2;
  return 1;
}

function getVisibleGroup(array, startIndex, groupSize) {
  const result = [];
  const len = array.length;
  for (let i = 0; i < groupSize; i++) {
    const idx = (startIndex + i) % len;
    result.push(array[idx]);
  }
  return result;
}

function enableClicks(items) {
  // Remove handlers antigos
  charContainers.forEach(item => item.onclick = null);

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (animating || isResizing) return; // ainda respeita flags de animação/resize

      // Visual: remove 'active' de todos e adiciona ao clicado
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Inicia a transição com fade (bloqueando cliques durante)
      const operatorId = item.dataset.id;
      fadeTransitionOperatorChange(operatorId);

      // Marca o container clicado como "ativo"
      charContainers.forEach(c => c.classList.remove('active-operator'));
      item.classList.add('active-operator');
    });
  });
}

function clearStyles(items) {
  items.forEach(item => 
    ['opacity', 'transform', 'transition', 'transitionDelay'].forEach(property => item.style[property] = '')
  );
}

function animateItems(items, direction = 'leftToRight') {

  animating = true;
  const translateDirection = direction === 'leftToRight' ? 'translateX(100%)' : 'translateX(-100%)';
  items.forEach((item) => {
    const baseTransform = 'rotate3d(1, 0, 0, 30deg) rotateY(180deg)';
    Object.assign(item.style, {
      opacity: '0',
      transform: `${baseTransform} ${translateDirection} translateY(-10%)`,
      transition: 'none',
      transitionDelay: ''
    });
  });

  requestAnimationFrame(() => {
    void items[0].offsetWidth;
    items.forEach((item, i) => {
      const baseTransform = 'rotate3d(1, 0, 0, 30deg) rotateY(0deg)';
      Object.assign(item.style, {
        opacity: '1',
        transform: `${baseTransform} translateX(0) translateY(0)`,
        transition: 'opacity 1s ease, transform 0.8s ease',
        transitionDelay: `${i * 100}ms`
      });
    });

    const defaultLastItemStates = () => {
        animating = false;
        clearStyles(items);
        enableClicks(items);
        lastItem.removeEventListener('transitionend', onTransitionEnd);
    }

    const lastItem = items[items.length - 1];
    const onTransitionEnd = (e) => {
      if (e.propertyName === 'opacity') { defaultLastItemStates(); }
    };

    const timeoutId = setTimeout(() => {
      if (animating) { defaultLastItemStates(); }
    }, 1500);

    lastItem.addEventListener('transitionend', (e) => {
      clearTimeout(timeoutId);
      onTransitionEnd(e);
    });
  });
}

function renderPage(animate = true, direction = 'leftToRight') {

  const resetContainers = (containers) => {
  containers.forEach(item => {
    item.style.display = 'none';
    

    // Remove todas as classes que começam com "visible-"
    item.classList.forEach(cls => {
      if (cls.startsWith('visible-')) {
        item.classList.remove(cls);
      }
    });
  });
  }

  const showVisibleItems = (items, visibleCount) => {
  items.forEach(item => {
    item.style.display = 'flex';
    item.classList.add(`visible-${visibleCount}`);
    item.parentElement.appendChild(item);
  });
  }

  const visibleCount = getVisibleCount();
  const itemsToShow = getVisibleGroup(charContainers, currentIndex, visibleCount);

  resetContainers(charContainers);
  showVisibleItems(itemsToShow, visibleCount);

  if (animate && !isResizing) { animateItems(itemsToShow, direction); } 

  else { clearStyles(itemsToShow); enableClicks(itemsToShow); }
}

function nextPage() {
  if (animating || isResizing) return;
  const visibleCount = getVisibleCount();
  currentIndex = (currentIndex + visibleCount) % charContainers.length;
  renderPage(true, 'leftToRight');
}

function prevPage() {
  if (animating || isResizing) return;
  const visibleCount = getVisibleCount();
  currentIndex = (currentIndex - visibleCount + charContainers.length) % charContainers.length;
  renderPage(true, 'rightToLeft');
}

// Redimensionamento
window.addEventListener('resize', () => {
  if (animating) return;

  isResizing = true;
  
  // Remover o reset de currentIndex, mantendo o valor atual
  renderPage(false);  // Não anima na mudança, só ajusta a exibição.

  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    isResizing = false;
  }, 300);
});

// --- Implementa drag e touch para navegação ---
let pageDragIsDragging = false;

let pageDragStartX = pageDragDiffX = 0;

function startPageDrag(e) {
  if (animating) return;
  pageDragIsDragging = true;
  pageDragStartX = e.touches ? e.touches[0].pageX : e.pageX;
}

function movePageDrag(e) {
  if (!pageDragIsDragging) return;
  const currentX = e.touches ? e.touches[0].pageX : e.pageX;
  pageDragDiffX = currentX - pageDragStartX;
}

function endPageDrag() {
  if (!pageDragIsDragging) return;

  pageDragIsDragging = false;
  const threshold = 50;

  if (pageDragDiffX > threshold) { prevPage(); } 

  else if (pageDragDiffX < -threshold) { nextPage(); }
  pageDragDiffX = 0;
}

function addListeners(element, events, handler) {
  events.forEach(event => element.addEventListener(event, handler));
}

addListeners(outerContainer, ['touchstart', 'mousedown'], startPageDrag);
addListeners(outerContainer, ['touchmove', 'mousemove'], movePageDrag);
addListeners(outerContainer, ['touchend', 'mouseup', 'mouseleave'], endPageDrag);

// Exibe a primeira página
renderPage(false);

// Testing local backup