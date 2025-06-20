"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("./config");
if (!config_1.config.supabase.url || !config_1.config.supabase.key) {
    throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
}
exports.supabase = (0, supabase_js_1.createClient)(config_1.config.supabase.url, config_1.config.supabase.key);
