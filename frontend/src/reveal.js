const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        }
    });
}, {
    threshold: 0.15
});

export default {
    mounted(el) {
        observer.observe(el);
    },

    unmounted(el) {
        observer.unobserve(el);
    }
}