const Footer = () => {
    return (
        <footer className="py-16 bg-background border-t border-border">
            <div className="max-w-[1800px] mx-auto px-8 md:px-16">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <a href="#" className="text-xl font-medium text-text-primary tracking-tight">
                        BookMart<span className="text-primary">.</span>
                    </a>
                    <div className="flex items-center gap-8 text-sm text-text-secondary">
                        <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
                        <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
                        <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
                    </div>
                    <p className="text-sm text-text-muted">© 2026 BookMart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
