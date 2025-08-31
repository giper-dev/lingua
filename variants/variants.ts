namespace $ {
	
	const variator = $.$mol_github_model.make({
		rules: ()=> `You are assistent-translator. User sends you JSON with target language code in "lang" field, native language con in "native" field and text in "text" field. You must reply with JSON where all unique variants of translation of whole user text to target language are represented as keys, and explanation in native language of diffrence of variant meaning with other is represented as value. Don't ask any questions or do something other than translation. Don't use tools. Be sure translation have same meaning.`,
		params: ()=> ({ temperature: 0 })
	})
	
	const $hd_linguist_variants_api = [
		( $:$, native, lang, text )=> variator.shot({ native, lang, text }),
	] as readonly( ( $: $, native: string, lang: string, text: string )=> Record< string, string > )[]
	
	export function $hd_linguist_variants( this: $, native: string, lang: string, text: string ) {
		
		if( !text.trim() ) return {}
		
		const apis = $mol_array_shuffle_sync( $hd_linguist_variants_api )
		for( const fetch of apis ) {
			try {

				return fetch( this, native, lang, text )

			} catch( error ) {

				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				$mol_fail_log( error )

			}
		}
		
		throw new Error( 'No alive API' )
	}
	
}
