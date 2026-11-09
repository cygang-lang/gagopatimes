/* 가고파타임즈 1면 인트로 (7초)
 * 1면(index.html)에 들어온 독자에게 그날 호의 제호·머리기사·요약을 7초 동안 보여 준다.
 * - 같은 브라우저에서는 호마다 한 번만 재생한다(주소 끝에 ?intro 를 붙이면 다시 재생).
 * - 화면을 누르거나 Esc·Enter·스페이스, 스크롤하면 바로 넘어간다.
 * - '동작 줄이기'를 켠 독자에게는 재생하지 않는다(head 의 짧은 스크립트가 판단).
 * 장면은 CSS 가 첫 화면과 함께 시작하고, 여기서는 진행 막대가 시작된 때부터 7초를 재서 닫는다.
 */
(function () {
  var root = document.documentElement;
  var box = document.getElementById('intro');
  if (!box) return;
  if (!root.classList.contains('intro-on')) { box.remove(); return; }

  var TOTAL = 7000, EXIT = 650, done = false;

  function finish() {
    if (done) return;
    done = true;
    box.classList.add('leave');
    setTimeout(function () {
      root.classList.remove('intro-on');
      box.remove();
    }, EXIT);
  }

  // 진행 막대 애니메이션이 실제로 화면에서 돌기 시작한 뒤, 흐른 시간을 빼고 남은 만큼 기다린다
  // (첫 화면이 늦게 그려져도 장면이 잘리지 않게 한다)
  function schedule(elapsed) { setTimeout(finish, Math.max(0, TOTAL - EXIT - (elapsed || 0))); }
  try {
    var bar = box.querySelector('.i-bar');
    var anim = bar && bar.getAnimations ? bar.getAnimations()[0] : null;
    if (anim && anim.ready) anim.ready.then(function (a) { schedule(a.currentTime); }, function () { schedule(0); });
    else schedule(0);
  } catch (err) { schedule(0); /* 오래된 브라우저는 지금부터 잰다 */ }
  setTimeout(finish, 12000); // 어떤 경우에도 12초 뒤에는 닫는다

  box.addEventListener('click', finish);
  document.addEventListener('keydown', function (ev) {
    if (!done && (ev.key === 'Escape' || ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); finish(); }
  });
  window.addEventListener('wheel', finish, { passive: true, once: true });
  window.addEventListener('touchmove', finish, { passive: true, once: true });
})();
