import Mermaid from "../components/Mermaid";

export default function Home() {
    return (
        <>
            <nav className="navbar">
                <div className="container" style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <h1 className="logo">Chapter 05 <span>Binding - Routing - Validation</span></h1>
                    <ul className="nav-links">
                        <li><a href="#overview"><i className="fas fa-globe"></i> Overview</a></li>
                        <li><a href="#routing"><i className="fas fa-link"></i> Routing</a></li>
                        <li><a href="#binding"><i className="fas fa-puzzle-piece"></i> Binding</a></li>
                        <li><a href="#validation"><i className="fas fa-shield-halved"></i> Validation</a></li>
                        <li><a href="#patterns"><i className="fas fa-layer-group"></i> Patterns</a></li>
                    </ul>
                </div>
            </nav>

            <header className="hero">
                <div className="container">
                    <h2>Request Life Cycle</h2>
                    <p>Comprehensive technical deep dive into ASP.NET Core: Routing, Model Binding, and Validation Pipeline.</p>
                </div>
            </header>

            <main className="container">
                {/* Pipeline Overview Section */}
                <section id="overview" className="diagram-section">
                    <div className="section-header">
                        <h3>ASP.NET Core Request Processing Pipeline</h3>
                        <p>The integrated flow where a URL request is directed to an endpoint, data is extracted from sources,
                            and then verified for integrity before processing.</p>
                    </div>
                    <div className="card">
                        <div className="mermaid-container">
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'step', 'nodeSpacing': 20, 'rankSpacing': 30}}}%%
flowchart LR
    Globe(["HTTP Request"]) --> Step1["Step 1:<br/>UseRouting()"]
    Step1 --> Routing["Routing Match<br/>(Controller Action)"]
    
    %% Xuống dòng bằng cách bẻ node (Zigzag)
    Routing --> Step2["Step 2:<br/>Model Binding"]
    
    Step2 --> Step3["Step 3:<br/>Model Validation"]
    Step3 --> Step4{"Step 4:<br/>Gatekeeper<br/>IsValid?"}
    
    Step4 -- "True" --> Step5["Step 5:<br/>Action Execute"]
    Step4 -- "False" --> Error["400 Bad<br/>Request"]
    
    Step5 & Error --> Response(["HTTP Response"])

    %% Styling đồng bộ
    style Globe fill:#0f172a,stroke:#38bdf8,color:#e5f6ff
    style Step1 fill:#eef2ff,stroke:#002366,color:#002366
    style Routing fill:#020617,stroke:#475569,color:#e2e8f0
    style Step2 fill:#f5f3ff,stroke:#4b0082,color:#4b0082
    style Step3 fill:#fff7ed,stroke:#ff4500,color:#ff4500
    style Step4 fill:#fffbeb,stroke:#f59e0b,color:#92400e
    style Step5 fill:#022c22,stroke:#10b981,color:#bbf7d0
    style Error fill:#450a0a,stroke:#ef4444,color:#fecaca
    style Response fill:#0f172a,stroke:#38bdf8,color:#e5f6ff
                            `} />
                        </div>

                        <div className="explanation-grid">
                            <div className="explanation-col">
                                <h4><span className="badge">1</span> <i className="fas fa-link"></i> Routing</h4>
                                <p><strong>UseRouting()</strong> identifies the correct path. It compares the incoming URL
                                    against defined templates to select the target <strong>Controller & Action</strong>.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">2</span> <i className="fas fa-puzzle-piece"></i> Model Binding</h4>
                                <p>Data is extracted from <strong>Route, Query, Form, or Body</strong>. The system automatically
                                    maps these raw values into strongly-typed C# <strong>Action Parameters</strong>.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">3</span> <i className="fas fa-shield-halved"></i> Model Validation</h4>
                                <p>The system evaluates <strong>DataAnnotations</strong> (like [Required], [Email]) to ensure
                                    the model matches the expected business rules and integrity constraints.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">4</span> <i className="fas fa-door-open"></i> Gatekeeper</h4>
                                <p>Checks <strong>ModelState.IsValid</strong>. If validation fails (False), it triggers a
                                    <strong>400 Bad Request</strong>. If successful (True), it proceeds to the core logic
                                    handler.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">5</span> <i className="fas fa-code"></i> Controller Action</h4>
                                <p>The final destination where <strong>Business Logic</strong> is executed, interacting with
                                    services or databases to generate the final <strong>HTTP Response</strong>.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Routing Section */}
                <section id="routing" className="diagram-section">
                    <div className="section-header">
                        <h3>URL Routing Engine</h3>
                        <p>Mapping URLs to executable resources via Middleware and Route Templates.</p>
                    </div>
                    <div className="card routing-card">
                        <div className="mermaid-container">
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'step', 'nodeSpacing': 20, 'rankSpacing': 30}}}%%
                                flowchart LR
                                Start([1. URL Received]) --> Middleware["2. UseRouting middleware<br/>(Enable Routing)"]
                                Middleware --> Matching{3. Pattern Matching}

                                Matching -- "Attribute Routing<br/>(Recommended)" --> Attr["4. [Route('orders/{id}')]"]
                                Matching -- "Conventional Routing" --> Conv["4. MapControllerRoute(...)"]

                                %% Nhánh phụ mô tả Dynamic Configs
                                Attr -.-> D1["{Id}"]
                                Attr -.-> D2["{Gender}/{CityId}"]

                                Matching --> Multi["Multiple URLs Single Resource"]

                                %% Gom lại nhánh chính
                                Attr --> UseEndpoints["5. UseEndpoints()<br/>(Map to Resources)"]
                                Conv --> UseEndpoints

                                UseEndpoints --> Action["6. Action Method Execution"]

                                style Start fill:#2563eb,color:#fff
                                style Action fill:#10b981,color:#fff
                                style Middleware fill:#4c1d95,color:#fff
                                style UseEndpoints fill:#4c1d95,color:#fff
                            `} />
                        </div>

                        <div className="explanation-grid">
                            <div className="explanation-col">
                                <h4><i className="fas fa-info-circle"></i> Definition</h4>
                                <p>Routing infrastructure is responsible for parsing URL patterns and directing HTTP requests to
                                    specific endpoint handlers.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-list-ol"></i> Steps</h4>
                                <ul style={{ listStyle: "none", padding: 0 }}>
                                    <li style={{ marginBottom: "0.5rem" }}><strong>1.</strong> URL Received</li>
                                    <li style={{ marginBottom: "0.5rem" }}><strong>2.</strong> Middleware Registration</li>
                                    <li style={{ marginBottom: "0.5rem" }}><strong>3.</strong> Pattern Matching Logic</li>
                                    <li style={{ marginBottom: "0.5rem" }}><strong>4.</strong> Handler Execution</li>
                                </ul>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-tools"></i> Tools</h4>
                                <p>Use <code>[Route]</code>, <code>[HttpGet]</code>, and <code>EndpointRouting</code> to fine-tune your mapping logic.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Binding Section */}
                <section id="binding" className="diagram-section">
                    <div className="section-header">
                        <h3>Model Binding Mechanism</h3>
                        <p>Extracting request data and populating strongly-typed Action parameters.</p>
                    </div>
                    <div className="card binding-card">
                        <div className="mermaid-container">
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'step', 'nodeSpacing': 20, 'rankSpacing': 30}}}%%
                                flowchart LR
                                %% 1. Data Sources
                                subgraph Sources["1. Data Sources"]
                                direction TB
                                Form["Form (POST)"] ~~~ Route["Route Values"] ~~~ Query["Query String"] ~~~ Body["JSON Body"] ~~~ Header["Headers"]
                                end

                                Sources --> Decide["2. Choose<br/>Binder Type"]

                                %% 2. Primitive vs Complex
                                Decide --> Primitive["3A. Primitive Binder<br/>(simple types)"]
                                Decide --> Complex["3B. Complex Binder<br/>(object graph)"]

                                Primitive --> Result["4. Bound Parameters<br/>(int, string, DTOs...)"]
                                Complex --> Result

                                %% 3. Source Attributes
                                subgraph Attributes["Source Attributes (Optional)"]
                                direction TB
                                SR["[FromRoute]"] ~~~ SQ["[FromQuery]"] ~~~ SB["[FromBody]"] ~~~ SF["[FromForm]"] ~~~ SH["[FromHeader]"] ~~~ SS["[FromServices]"]
                                end

                                Result -.-> Attributes

                                %% Styling
                                style Sources fill:transparent,stroke:#94a3b8,stroke-dasharray: 5 5
                                style Decide fill:#1e293b,color:#fff
                                style Primitive fill:#2563eb,color:#fff
                                style Complex fill:#4c1d95,color:#fff
                                style Result fill:#10b981,color:#fff
                                style Attributes fill:transparent,stroke:#94a3b8,stroke-dasharray: 5 5
                            `} />
                        </div>

                        <div className="explanation-grid">
                            <div className="explanation-col">
                                <h4><i className="fas fa-database"></i> Source Matrix</h4>
                                <p>The engine automatically scans multiple sources based on convention or explicit attributes.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-cogs"></i> Process</h4>
                                <p>Model binders bridge the gap between HTTP strings and .NET types, handling collections and complex trees.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-tags"></i> Attributes</h4>
                                <p>Override defaults using <code>[FromBody]</code>, <code>[FromQuery]</code>, or <code>[FromRoute]</code>.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Validation Section */}
                <section id="validation" className="diagram-section">
                    <div className="section-header">
                        <h3>Model Validation Pipeline</h3>
                        <p>Ensuring data integrity and security through metadata-based constraints.</p>
                    </div>
                    <div className="card validation-card">
                        <div className="mermaid-container">
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'step', 'nodeSpacing': 20, 'rankSpacing': 30}}}%%
                                flowchart LR
                                Model([Bound Model]) --> DataAnnot["Data Annotations Check"]

                                subgraph Attributes [Built-in Constraints]
                                direction TB
                                R["[Required]"] ~~~ S["[StringLength]"] ~~~ RA["[Range]"] ~~~ E["[Email/Url/Phone]"] ~~~ RG["[RegularExpression]"]
                                end

                                DataAnnot -.-> Attributes

                                DataAnnot --> UpdateState["Update ModelState<br/>Dictionary"]
                                UpdateState --> Decision{ModelState.IsValid?}

                                Decision -- "False" --> Error["400 Bad Request /<br/>Client Error"]
                                Decision -- "True" --> Success["Proceed to<br/>Business Logic"]

                                subgraph Compare [Server vs Client]
                                direction TB
                                SV["Server: Safe & Secure"] ~~~ CL["Client: JS/jQuery<br/>(Fast UX)"]
                                end

                                Success --> SV
                                Error --> CL

                                style Model fill:#2563eb,color:#fff
                                style DataAnnot fill:#4c1d95,color:#fff
                                style Decision fill:#4c1d95,color:#fff
                                style Success fill:#10b981,color:#fff
                                style Error fill:#ef4444,color:#fff
                            `} />
                        </div>

                        <div className="explanation-grid">
                            <div className="explanation-col">
                                <h4><i className="fas fa-check-double"></i> Strategy</h4>
                                <p>Execute business rules via metadata. Ensure safety at the server level regardless of client UX.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-exclamation-triangle"></i> Feedback</h4>
                                <p>Populate <code>ModelState</code> to provide immediate, actionable feedback for invalid input.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><i className="fas fa-shield-alt"></i> Security</h4>
                                <p>Prevents over-posting and SQL injection by validating the shape and content of input models.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Patterns Section */}
                <section id="patterns" className="diagram-section">
                    <div className="section-header">
                        <h3>Architectural Patterns</h3>
                        <p>Establishing clean, maintainable, and decoupled systems.</p>
                    </div>
                    <div className="card">
                        <div className="explanation-grid">
                            <div className="explanation-col">
                                <h4><span className="badge">R</span> Repository Pattern</h4>
                                <p>Creates an abstraction layer between data access and business logic. Promotes loose coupling
                                    and easier unit testing.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">D</span> DTOs & Mappings</h4>
                                <p><strong>Data Transfer Objects:</strong> Manipulates and returns data without exposing
                                    internal database entities directly.</p>
                            </div>
                            <div className="explanation-col">
                                <h4><span className="badge">A</span> AutoMapper</h4>
                                <p>A specialized library used to automatically map properties between Entities and DTOs,
                                    reducing repetitive boilerplate code.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2026 ASP.NET Core Architecture Hub | Technical Documentation Architecture</p>
                </div>
            </footer>
        </>
    );
}
