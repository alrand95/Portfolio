'use client';

import React, { useRef, useEffect } from 'react';

export function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: { x: number; y: number; radius: number; alpha: number; dAlpha: number }[] = [];
        let shootingStars: { x: number; y: number; length: number; speed: number; angle: number }[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 4000);
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    dAlpha: (Math.random() - 0.5) * 0.02,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Stars
            ctx.fillStyle = "#FFF";
            stars.forEach((star) => {
                star.alpha += star.dAlpha;
                if (star.alpha <= 0 || star.alpha >= 1) star.dAlpha *= -1;

                ctx.beginPath();
                ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();

                // Optional glow
                if (star.radius > 1.2) {
                    ctx.globalAlpha = star.alpha * 0.3;
                    ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            // Simple Shooting Star Logic
            if (Math.random() < 0.01 && shootingStars.length < 2) {
                shootingStars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height / 2,
                    length: Math.random() * 80 + 20,
                    speed: Math.random() * 10 + 5,
                    angle: Math.PI / 4 // 45 degrees
                });
            }

            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.globalAlpha = 1;

            shootingStars.forEach((star, index) => {
                star.x += star.speed * Math.cos(star.angle);
                star.y += star.speed * Math.sin(star.angle);

                const endX = star.x - star.length * Math.cos(star.angle);
                const endY = star.y - star.length * Math.sin(star.angle);

                const grad = ctx.createLinearGradient(star.x, star.y, endX, endY);
                grad.addColorStop(0, "rgba(255,255,255,1)");
                grad.addColorStop(1, "rgba(255,255,255,0)");
                ctx.strokeStyle = grad;

                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                if (star.x > canvas.width || star.y > canvas.height) {
                    shootingStars.splice(index, 1);
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 bg-[#0a0514]"
        />
    );
}
