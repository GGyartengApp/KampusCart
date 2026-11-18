import * as THREE from 'three';

const textureCache = new Map();

export function getShirtDecalTexture(designId) {
  if (textureCache.has(designId)) return textureCache.get(designId);

  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  if (designId === 'just-do-it') {
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 84px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('JUST', 256, 195);
    ctx.fillText('DO IT', 282, 320);

    // Swoosh arc
    ctx.beginPath();
    ctx.moveTo(105, 225);
    ctx.quadraticCurveTo(95, 285, 170, 272);
    ctx.lineTo(405, 212);
    ctx.quadraticCurveTo(185, 248, 145, 232);
    ctx.quadraticCurveTo(125, 225, 125, 195);
    ctx.closePath();
    ctx.fill();
  } else if (designId === 'adventure-pine') {
    // Full moon
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(265, 128, 38, 0, Math.PI * 2);
    ctx.fill();

    // Stars
    ctx.fillStyle = '#ffffff';
    [
      [115, 110],
      [155, 145],
      [195, 105],
      [345, 125],
      [385, 155],
    ].forEach(([sx, sy]) => {
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Mountain peak
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(135, 305);
    ctx.lineTo(245, 195);
    ctx.lineTo(340, 305);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2f2420';
    ctx.beginPath();
    ctx.moveTo(245, 215);
    ctx.lineTo(285, 275);
    ctx.lineTo(220, 275);
    ctx.closePath();
    ctx.fill();

    // Pine trees
    ctx.fillStyle = '#84cc16';
    [
      [110, 310, 58],
      [135, 310, 44],
      [355, 310, 74],
      [392, 310, 56],
    ].forEach(([tx, ty, th]) => {
      ctx.beginPath();
      ctx.moveTo(tx, ty - th);
      ctx.lineTo(tx - 18, ty);
      ctx.lineTo(tx + 18, ty);
      ctx.closePath();
      ctx.fill();
    });

    // ADVENTURE text + orange brush
    ctx.fillStyle = '#f8fafc';
    ctx.font = '800 54px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ADVENTURE', 256, 372);

    ctx.fillStyle = '#ea580c';
    ctx.fillRect(118, 386, 125, 12);
    ctx.fillRect(268, 386, 125, 12);
  } else if (designId === 'air-red') {
    // Crimson Jumpman-inspired basketball silhouette
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(285, 108, 16, 0, Math.PI * 2); // ball
    ctx.fill();
    ctx.beginPath();
    ctx.arc(252, 162, 18, 0, Math.PI * 2); // head
    ctx.fill();

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 22;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(252, 178);
    ctx.lineTo(246, 255); // torso
    ctx.moveTo(252, 195);
    ctx.lineTo(282, 120); // raised arm
    ctx.moveTo(252, 195);
    ctx.lineTo(192, 240); // extended arm
    ctx.moveTo(246, 255);
    ctx.lineTo(175, 330); // left leg
    ctx.moveTo(246, 255);
    ctx.lineTo(335, 325); // right leg
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.font = '800 42px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('A   I   R', 256, 392);
  } else if (designId === 'adventure-begins') {
    // Teal & yellow circular badge
    ctx.fillStyle = '#14b8a6';
    ctx.beginPath();
    ctx.arc(256, 238, 138, 0, Math.PI * 2);
    ctx.fill();

    // Sun
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(256, 228, 66, 0, Math.PI * 2);
    ctx.fill();

    // Mountains
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(132, 265);
    ctx.lineTo(205, 185);
    ctx.lineTo(256, 232);
    ctx.lineTo(308, 175);
    ctx.lineTo(380, 265);
    ctx.closePath();
    ctx.fill();

    // White ribbon banner
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(102, 255, 308, 54);
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 40px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ADVENTURE', 256, 296);

    ctx.fillStyle = '#fde047';
    ctx.font = '700 20px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('• BEGINS •', 256, 334);
    ctx.font = '600 16px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('WHERE THE ROAD ENDS', 256, 358);
  } else if (designId === 'jordan-type') {
    // Bold white J O R D A N lettering behind red silhouette
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 76px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('J O R D A N', 256, 275);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(268, 132, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(245, 185, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(245, 200);
    ctx.lineTo(242, 265);
    ctx.moveTo(245, 212);
    ctx.lineTo(268, 144);
    ctx.moveTo(245, 212);
    ctx.lineTo(196, 252);
    ctx.moveTo(242, 265);
    ctx.lineTo(178, 332);
    ctx.moveTo(242, 265);
    ctx.lineTo(318, 326);
    ctx.stroke();
  } else {
    // MOUNTAIN vintage sunset circle
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(256, 250, 148, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 250, 140, 0, Math.PI * 2);
    ctx.fill();

    // Retro stripes
    const stripeColors = ['#ea580c', '#f59e0b', '#14b8a6'];
    stripeColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.fillRect(156 + i * 66, 150, 62, 110);
    });

    // Mountain silhouette
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(132, 265);
    ctx.lineTo(222, 175);
    ctx.lineTo(268, 222);
    ctx.lineTo(312, 182);
    ctx.lineTo(380, 265);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 44px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MOUNTAIN', 256, 326);

    ctx.font = '700 15px "Plus Jakarta Sans", Arial, sans-serif';
    ctx.fillText('THE ADVENTURE ARE CALLING', 256, 134);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  textureCache.set(designId, tex);
  return tex;
}
