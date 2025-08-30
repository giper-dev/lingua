namespace $ {
	
	const github_llm_translator = $.$mol_github_model.make({
		rules: ()=> `You are assistent-translator. User sends you language code and text in JSON format. You must reply with translation of his text to that language. Don't ask any questions or do something other than translation. Be sure translation have same meaning. Output translation as JSON string with correct escaping.`,
		params: ()=> ({ temperature: 0 })
	})
	
	const $hd_linguist_translate_api = [
		( $:$, lang, text )=> github_llm_translator.shot({ lang, text }).text,
	] as readonly( ( $: $, lang: string, text: string )=> string )[]
	
	export function $hd_linguist_translate( this: $, lang: string, text: string ) {
		
		if( !text.trim() ) return ''
		
		const apis = $mol_array_shuffle_sync( $hd_linguist_translate_api )
		for( const fetch of apis ) {
			try {

				const res = fetch( this, lang, text )
				if( res === undefined ) $mol_fail( new Error( 'Broken API' ) )
				return res

			} catch( error ) {

				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				$mol_fail_log( error )

			}
		}
		
		throw new Error( 'No alive API' )
	}
	
}
