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
                <section id="overview" className="overview-section">
                    <div className="section-header">
                        <h3>ASP.NET Core Request Processing Pipeline</h3>
                        <p>The integrated flow where a URL request is directed to an endpoint, data is extracted from sources,
                            and then verified for integrity before processing.</p>
                    </div>
                    <div className="card" style={{ borderTop: "4px solid var(--primary)" }}>
                        <div className="mermaid-container">
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'basis', 'nodeSpacing': 70, 'rankSpacing': 80}}}%%
                                flowchart TD
                                %% Nodes
                                Globe(["HTTP Request"])
                                Step1["Step 1: UseRouting()"]
                                Routing["Routing Match<br/>(Controller & Action)"]
                                Step2["Step 2: Model Binding"]
                                Step3["Step 3: Model Validation"]
                                Step4{"Step 4: Gatekeeper<br/>ModelState.IsValid?"}
                                Step5["Step 5: Controller Action<br/>(Process Logic)"]
                                Error["400 Bad Request<br/>(Invalid Data)"]
                                Response(["HTTP Response"])

                                %% Flow
                                Globe --> Step1 --> Routing --> Step2 --> Step3 --> Step4
                                Step4 -- "False" --> Error
                                Step4 -- "True" --> Step5
                                Step5 --> Response
                                Error --> Response

                                %% Detailed Styling
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

                        <div className="explanation-grid"
                            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
                            <div className="explanation-col"
                                style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                                <h4><span className="badge blue">1</span> <i className="fas fa-link"></i> Routing</h4>
                                <p><strong>UseRouting()</strong> identifies the correct path. It compares the incoming URL
                                    against defined templates to select the target <strong>Controller & Action</strong>.</p>
                            </div>
                            <div className="explanation-col"
                                style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                                <h4><span className="badge blue">2</span> <i className="fas fa-puzzle-piece"></i> Model Binding</h4>
                                <p>Data is extracted from <strong>Route, Query, Form, or Body</strong>. The system automatically
                                    maps these raw values into strongly-typed C# <strong>Action Parameters</strong>.</p>
                            </div>
                            <div className="explanation-col"
                                style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                                <h4><span className="badge blue">3</span> <i className="fas fa-shield-halved"></i> Model Validation</h4>
                                <p>The system evaluates <strong>DataAnnotations</strong> (like [Required], [Email]) to ensure
                                    the model matches the expected business rules and integrity constraints.</p>
                            </div>
                            <div className="explanation-col"
                                style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                                <h4><span className="badge blue">4</span> <i className="fas fa-door-open"></i> Gatekeeper</h4>
                                <p>Checks <strong>ModelState.IsValid</strong>. If validation fails (False), it triggers a
                                    <strong>400 Bad Request</strong>. If successful (True), it proceeds to the core logic
                                    handler.</p>
                            </div>
                            <div className="explanation-col"
                                style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                                <h4><span className="badge blue">5</span> <i className="fas fa-code"></i> Controller Action</h4>
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
                    <div className="card">
                        <div className="mermaid-container" style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                            <Mermaid chart={`
                                graph TD
                                Start([1. URL Received]) --> Middleware["2. UseRouting middleware (Enable Routing)"]
                                Middleware --> Matching{3. Pattern Matching}

                                Matching -- "Attribute Routing (Recommended)" --> Attr["4. [Route('orders/{id}')]"]
                                Matching -- "Conventional Routing" --> Conv["4. MapControllerRoute(...)"]

                                subgraph Dynamic_Vars [Dynamic Parameters]
                                D1["{Id}"]
                                D2["{Gender}/{CityId}"]
                                end

                                Attr -.-> Dynamic_Vars

                                Matching --> Multi["Multiple URLs Single Resource"]

                                Attr --> UseEndpoints["5. UseEndpoints() (Map to Resources)"]
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
                                <h4>Definition</h4>
                                <p>Routing infrastructure is responsible for parsing URL patterns and directing HTTP requests to
                                    specific endpoint handlers.</p>
                            </div>
                            <div className="explanation-col">
                                <h4>Workflow Steps</h4>
                                <ul>
                                    <li><strong>Step 1:</strong> System receives the raw URL from the client.</li>
                                    <li><strong>Step 2:</strong> <code>UseRouting()</code> adds matching info to the request.
                                    </li>
                                    <li><strong>Step 3-4:</strong> Match URL against Attribute or Conventional templates.</li>
                                    <li><strong>Step 5:</strong> <code>UseEndpoints()</code> executes the matched handler.</li>
                                    <li><strong>Step 6:</strong> Control is handed over to the target Action Method.</li>
                                </ul>
                            </div>
                            <div className="explanation-col">
                                <h4>Key Components</h4>
                                <ul>
                                    <li><code>UseRouting / UseEndpoints</code></li>
                                    <li><code>[Route], [HttpGet], [HttpPost]</code></li>
                                    <li><code>EndpointRoutingMiddleware</code></li>
                                </ul>
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
                    <div className="card">
                        <div className="mermaid-container" style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                            <Mermaid chart={`
                                %%{init: {'flowchart': {'curve': 'basis', 'nodeSpacing': 60, 'rankSpacing': 70}}}%%
                                flowchart TD
                                %% 1. Data Sources
                                subgraph Sources["1. Data Sources"]
                                Form["Form Data (POST)"]
                                Route["Route Values"]
                                Query["Query String"]
                                Body["JSON / XML Body"]
                                Header["Headers"]
                                end

                                Sources --> Decide["2. Choose Model Binder Type"]

                                %% 2. Primitive vs Complex
                                Decide --> Primitive["3A. Primitive Model Binder<br/>(simple types, URI-based)"]
                                Decide --> Complex["3B. Complex Model Binder<br/>(object graph, Body-based)"]

                                Primitive --> Result["4. Bound Action Parameters<br/>(int, string, bool, Guid, DateTime, DTOs, ...)"]
                                Complex --> Result

                                %% 3. Source Attributes
                                subgraph Attributes["Source Attributes (Optional)"]
                                SR["[FromRoute]"]
                                SQ["[FromQuery]"]
                                SB["[FromBody]"]
                                SF["[FromForm]"]
                                SH["[FromHeader]"]
                                SS["[FromServices]"]
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
                                <h4>Definition</h4>
                                <p>The process of retrieving data from HTTP Request sources and mapping it to Action Method
                                    parameters.</p>
                            </div>
                            <div className="explanation-col">
                                <h4>Workflow Steps</h4>
                                <ul>
                                    <li><strong>Step 1:</strong> Data is scanned from Body, Forms, Route, or Query.</li>
                                    <li><strong>Step 2:</strong> Primitive Binders handle simple types from the URI.</li>
                                    <li><strong>Step 3:</strong> Complex Binders handle JSON/XML objects from the Body.</li>
                                    <li><strong>Step 4:</strong> Binders populate the target C# objects.</li>
                                    <li><strong>Step 5:</strong> The action receives fully-typed parameters.</li>
                                </ul>
                            </div>
                            <div className="explanation-col">
                                <h4>Key Components</h4>
                                <ul>
                                    <li><code>[FromBody], [FromQuery], [FromRoute]</code></li>
                                    <li><code>IModelBinder / ValueProviders</code></li>
                                    <li><code>Default Value Handling</code></li>
                                </ul>
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
                    <div className="card">
                        <div className="mermaid-container" style={{ display: "flex", justifyContent: "center", marginBottom: "3rem" }}>
                            <Mermaid chart={`
                                graph TD
                                Model([Bound Model]) --> DataAnnot["Data Annotations Check"]

                                subgraph Attributes [Built-in Constraints]
                                R["[Required]"]
                                S["[StringLength]"]
                                RA["[Range]"]
                                E["[Email/Url/Phone]"]
                                RG["[RegularExpression]"]
                                end

                                DataAnnot -.-> Attributes

                                DataAnnot --> UpdateState["Update ModelState Dictionary"]
                                UpdateState --> Decision{ModelState.IsValid?}

                                Decision -- "False" --> Error["400 Bad Request / Client Error"]
                                Decision -- "True" --> Success["Proceed to Business Logic"]

                                subgraph Compare [Server vs Client]
                                SV["Server: Safe & Secure"]
                                CL["Client: JS/jQuery (Fast UX)"]
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
                                <h4>Definition</h4>
                                <p>Validation ensures that submitted data complies with security and business rules before
                                    execution.</p>
                            </div>
                            <div className="explanation-col">
                                <h4>Workflow Steps</h4>
                                <ul>
                                    <li><strong>Step 1:</strong> Validator receives the model after binding success.</li>
                                    <li><strong>Step 2:</strong> Class is scanned for Data Annotation attributes.</li>
                                    <li><strong>Step 3:</strong> Errors are populated into the <code>ModelState</code>
                                        dictionary.</li>
                                    <li><strong>Step 4:</strong> Code evaluates <code>ModelState.IsValid</code> status.</li>
                                    <li><strong>Step 5:</strong> Returns 400 Bad Request or proceeds to logic.</li>
                                </ul>
                            </div>
                            <div className="explanation-col">
                                <h4>Key Components</h4>
                                <ul>
                                    <li><code>[Required], [Range], [StringLength]</code></li>
                                    <li><code>ModelStateDictionary / IsValid</code></li>
                                    <li><code>Client-side (Unobtrusive JS)</code></li>
                                </ul>
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
