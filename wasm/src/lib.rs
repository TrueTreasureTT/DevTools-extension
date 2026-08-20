use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn analyze(source: &str) -> String {
    let html_nodes = source.matches('<').count();
    let css_rules = source.matches('{').count();
    format!("{{\"bytes\":{},\"htmlMarkers\":{},\"cssRuleMarkers\":{}}}", source.len(), html_nodes, css_rules)
}
